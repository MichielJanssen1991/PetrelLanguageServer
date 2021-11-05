export function flattenArray<T>(nestedArray: T[][]): T[] {
  return nestedArray.reduce((acc, array) => [...acc, ...array], []);
}

export function flattenObjectValues<T>(object: { [key: string]: T[] }): T[] {
  return Object.keys(object).flatMap(objectKey => object[objectKey]);
}

export function flattenNestedObjectValues<T>(object: { [key: string]: { [key: string]: T[] } }): T[] {
  return Object.keys(object).flatMap(objectKey =>
    Object.keys(object[objectKey]).flatMap(innerKey => object[objectKey][innerKey])
  );
}

export function flattenNestedListObjects<T>(object: Record<string, Record<string, T[]>>): Record<string, T[]> {
  const flattenedObject: Record<string, T[]> = {};
  Object.keys(object).forEach(key => {
    Object.keys(object[key]).forEach(secondKey => {
      const list = object[key][secondKey] || [];
      flattenedObject[secondKey] = (flattenedObject[secondKey] || []).concat(list);
    });
  });
  return flattenedObject;
}