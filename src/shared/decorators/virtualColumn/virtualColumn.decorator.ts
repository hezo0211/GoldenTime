import 'reflect-metadata';
export const VIRTUAL_COLUMN_KEY = Symbol('VIRTUAL_COLUMN_KEY');

export function VirtualColumn(name?: string): PropertyDecorator {
  return (target, propType) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, target) || {};
    metaInfo[propType] = name ?? propType;
    Reflect.defineMetadata(VIRTUAL_COLUMN_KEY, metaInfo, target);
  };
}
