allPropertiesDefined<T extends object>(obj: T): boolean {
  return Object.values(obj).every(value => value !== undefined);
}