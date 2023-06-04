interface CacheValue<KeyType = unknown, ValueType = unknown> {
  key: KeyType;
  value: ValueType;
}

const equals = (a: any, b: any) => {
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (
      aKeys.length === bKeys.length &&
      aKeys.every((aKey) => bKeys.includes(aKey) && equals(a[aKey], b[aKey]))
    ) {
      return true;
    }
  }
  return a === b;
};

export class CalculatorCache<KeyType, ValueType> {
  cache: CacheValue<KeyType, ValueType>[] = [];

  get(key: KeyType) {
    return this.cache.find((cached) => equals(cached.key, key))?.value;
  }

  // The cache assumes that every key only has one value which is added max. once
  put(key: KeyType, value: ValueType) {
    this.cache.push({ key, value });
  }
}
