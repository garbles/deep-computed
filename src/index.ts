const isObject = (obj: any): obj is Object =>
  Object.prototype.toString.call(obj) === '[object Object]';

const isFunction = (obj: any): obj is Function =>
  typeof obj === 'function';

const empty = <O>(obj: O) => {
  if (isObject(obj)) {
    return {};
  } else if (Array.isArray(obj)) {
    return [];
  }
}

const keys = <O, K extends (keyof O)[]>(obj: O): K => {
  if (isObject(obj)) {
    return Object.getOwnPropertyNames(obj) as K;
  } else {
    return Object.keys(obj) as K;
  }
}

function defineProperties<O, T, R>(obj: O, root?: R): T {
  const next = empty(obj);
  const props = keys(obj);

  if (!root) {
    root = next as R;
  }

  for (let key of props) {
    const value = obj[key];

    if (isFunction(value)) {
      Object.defineProperty(next, key, {
        get() {
          return value(root);
        },
        configurable: false
      });
      continue;
    }

    if (Array.isArray(value) || isObject(value)) {
      Object.defineProperty(next, key, {
        value: defineProperties(value, root),
        configurable: false
      });
      continue;
    }

    Object.defineProperty(next, key, { value, configurable: false });
  }

  return next as T;
}

export const deepComputed = <O, T, R = O>(obj: O): T => defineProperties<O, T, R>(obj);