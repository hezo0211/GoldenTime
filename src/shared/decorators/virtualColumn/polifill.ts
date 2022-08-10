import { VIRTUAL_COLUMN_KEY } from './virtualColumn.decorator';
import { SelectQueryBuilder } from 'typeorm';

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    // @ts-ignore
    executeEntitiesAndRawResults(): Promise<{ entities: Entity[]; raw: any[] }>;
    getMany(this: SelectQueryBuilder<Entity>): Promise<Entity[] | undefined>;
    getOne(this: SelectQueryBuilder<Entity>): Promise<Entity | undefined>;
  }
}

SelectQueryBuilder.prototype.getMany = async function () {
  const { entities, raw } = await this.getRawAndEntities();

  const items = entities.map((entitiy, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entitiy) ?? {};
    const item = raw[index];

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
      entitiy[propertyKey] = item[name];
    }

    return entitiy;
  });

  return [...items];
};

SelectQueryBuilder.prototype.getOne = async function () {
  const { entities, raw } = await this.getRawAndEntities();
  if (entities.length == 0) return null;

  const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entities[0]) ?? {};

  for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
    entities[0][propertyKey] = raw[0][name];
  }

  return entities[0];
};

// @ts-ignore
const originExecute = SelectQueryBuilder.prototype.executeEntitiesAndRawResults;
// @ts-ignore
SelectQueryBuilder.prototype.executeEntitiesAndRawResults = async function (
  queryRunner,
) {
  const { entities, raw } = await originExecute.call(this, queryRunner);
  entities.forEach((entity, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
    const item = raw[index];

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
      entity[propertyKey] = item[name];
    }
  });
  return { entities, raw };
};
