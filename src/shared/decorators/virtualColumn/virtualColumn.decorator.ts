import 'reflect-metadata';
export const VIRTUAL_COLUMN_KEY = Symbol('VIRTUAL_COLUMN_KEY');

interface VirtualColumnOptions {
  name?: string;
}

export function VirtualColumn(
  options?: VirtualColumnOptions,
): PropertyDecorator {
  return (target, propType) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, target) || {};
    const { name } = options;

    metaInfo['propType'] = propType;
    metaInfo['name'] = name ?? propType;
    Reflect.defineMetadata(VIRTUAL_COLUMN_KEY, metaInfo, target);
  };
}
