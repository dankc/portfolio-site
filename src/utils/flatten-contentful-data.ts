import type { FlattenableValue, FlattenableObject, ContentfulEntry } from '@/types/contentful';

// Helper to check if an object has Contentful entry structure
const isContentfulEntry = (item: unknown): item is ContentfulEntry => {
  return (
    typeof item === 'object'
    && item !== null
    && 'sys' in item
    && 'metadata' in item
    && 'fields' in item
    && typeof (item as any).fields === 'object'
  );
};

const hasFields = (item: unknown): item is { fields: Record<string, unknown> } => {
  return typeof item === 'object' && item !== null && 'fields' in item && typeof (item as any).fields === 'object';
};

const flattenFields = (items: unknown[]): FlattenableValue[] => {
  return items
    .map((item): FlattenableValue => {
      if (hasFields(item)) {
        return item.fields as FlattenableObject;
      }
      return item as FlattenableValue;
    })
    .filter((item): item is NonNullable<FlattenableValue> => item !== null && item !== undefined);
};

const flattenArrayAndDrill = (array: unknown[], visited: Set<object>): FlattenableValue[] => {
  const flattened = flattenFields(array);
  return flattened
    .map((item) => {
      if (item === null || item === undefined) return undefined;
      if (typeof item !== 'object') return item;
      return flattenAllFields(item, visited);
    })
    .filter((item): item is NonNullable<FlattenableValue> => item !== null && item !== undefined);
};

const flattenAllFields = (object: FlattenableValue, visited: Set<object> = new Set()): FlattenableValue => {
  if (typeof object !== 'object' || object === null) {
    return object;
  }
  // Prevent infinite loop on circular references
  if (visited.has(object)) {
    return object;
  }
  visited.add(object);

  if (Array.isArray(object)) {
    return flattenArrayAndDrill(object, visited);
  }

  const result: FlattenableObject = {};

  Object.keys(object).forEach((key) => {
    const objectElement = (object as FlattenableObject)[key];

    // Skip sys and metadata properties
    if (key === 'sys' || key === 'metadata') {
      return;
    }

    if (Array.isArray(objectElement)) {
      result[key] = flattenArrayAndDrill(objectElement, visited);
    } else if (typeof objectElement === 'object' && objectElement !== null && Object.keys(objectElement as object).length > 0) {
      result[key] = flattenAllFields(objectElement, visited);
    } else {
      result[key] = objectElement;
    }
  });

  return result;
};

export { flattenFields, flattenAllFields, isContentfulEntry, hasFields };
