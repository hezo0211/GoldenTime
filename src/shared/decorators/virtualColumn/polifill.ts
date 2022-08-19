import { VIRTUAL_COLUMN_KEY } from './virtualColumn.decorator';
import { SelectQueryBuilder, getMetadataArgsStorage } from 'typeorm';
import { isNotEmptyObject } from 'class-validator';
declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    executeEntitiesAndRawResults(): Promise<{ entities: Entity[]; raw: any[] }>;
    getMany(this: SelectQueryBuilder<Entity>): Promise<Entity[] | undefined>;
    getOne(this: SelectQueryBuilder<Entity>): Promise<Entity | undefined>;
  }
}

SelectQueryBuilder.prototype.getMany = async function () {
  const { entities, raw } = await this.getRawAndEntities();

  const items = entities.map((entity, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
    if (isNotEmptyObject(metaInfo)) {
      const key = metaInfo['propType'];
      //Get list of primary metadata
      const primary = getMetadataArgsStorage()
        .filterColumns(entity.constructor)
        .filter((field) => field.options.primary == true);
      //Get table metadata
      const table = getMetadataArgsStorage().filterTables(
        entity.constructor,
      )[0];

      const index = raw.findIndex((data) => {
        const keys = Object.keys(data);
        return primary.every((prime) => {
          const lookupCol = `${
            table.name ?? entity.constructor.name.toLowerCase()
          }_${prime.options.name ?? prime.propertyName}`;
          if (keys.indexOf(lookupCol) == -1) return false;
          return entity[prime.propertyName] == data[lookupCol];
        });
      });

      if (index != -1) entity[key] = raw[index][metaInfo['name']];
    }
    return entity;
  });
  return [...items];
};

SelectQueryBuilder.prototype.getOne = async function () {
  const { entities, raw } = await this.getRawAndEntities();

  if (entities.length == 0) return null;

  const entity = entities[0];
  const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
  if (isNotEmptyObject(metaInfo)) {
    const key = metaInfo['propType'];
    entity[key] = raw[0][metaInfo['name']];

    //Get list of primary metadata
    const primary = getMetadataArgsStorage()
      .filterColumns(entity.constructor)
      .filter((field) => field.options.primary == true);
    //Get table metadata
    const table = getMetadataArgsStorage().filterTables(entity.constructor)[0];

    const index = raw.findIndex((data) => {
      const keys = Object.keys(data);
      return primary.every((prime) => {
        const lookupCol = `${
          table.name ?? entity.constructor.name.toLowerCase()
        }_${prime.options.name ?? prime.propertyName}`;
        if (keys.indexOf(lookupCol) == -1) return false;
        return entity[prime.propertyName] == data[lookupCol];
      });
    });
    if (index != -1) entity[key] = raw[index][metaInfo['name']];
  }
  return entity;
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const originExecute = SelectQueryBuilder.prototype.executeEntitiesAndRawResults;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

//Fix relation ormtype
SelectQueryBuilder.prototype.executeEntitiesAndRawResults = async function (
  queryRunner,
) {
  const { entities, raw } = await originExecute.call(this, queryRunner);
  entities.forEach((entity, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
    if (isNotEmptyObject(metaInfo)) {
      const key = metaInfo['propType'];
      //Get list of primary metadata
      const primary = getMetadataArgsStorage()
        .filterColumns(entity.constructor)
        .filter((field) => field.options.primary == true);
      //Get table metadata
      const table = getMetadataArgsStorage().filterTables(
        entity.constructor,
      )[0];

      const index = raw.findIndex((data) => {
        const keys = Object.keys(data);
        return primary.every((prime) => {
          const lookupCol = `${
            table.name ?? entity.constructor.name.toLowerCase()
          }_${prime.options.name ?? prime.propertyName}`;
          if (keys.indexOf(lookupCol) == -1) return false;
          return entity[prime.propertyName] == data[lookupCol];
        });
      });

      if (index != -1) entity[key] = raw[index][metaInfo['name']];
    }
  });
  return { entities, raw };
};
