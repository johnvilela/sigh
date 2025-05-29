/* eslint-disable @typescript-eslint/no-explicit-any */

export function getValue<T> (obj: T, path: string, defaultValue?: any): any {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result: any = obj;

  for (const key of keys) {
    if (result && (typeof result === 'object' || Array.isArray(result)) && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result;
}