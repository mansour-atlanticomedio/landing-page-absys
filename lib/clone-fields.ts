export function cloneFields<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => cloneFields(item)) as T
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, cloneFields(v)])) as T
  }
  return value
}
