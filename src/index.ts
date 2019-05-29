// prettier-ignore
type RecursiveComputable<T, Root> = {
  [K in keyof T]:
    T[K] extends object ? RecursiveComputable<T[K], Root> :
    T[K] | ((arg: Root) => T[K])
};

export type Computable<T> = RecursiveComputable<T, T>;

const isObject = (obj: any): obj is Object =>
  Object.prototype.toString.call(obj) === "[object Object]";

const isFunction = (obj: any): obj is Function => typeof obj === "function";

const empty = <O>(obj: O) => {
  if (isObject(obj)) {
    return {};
  } else if (Array.isArray(obj)) {
    return [];
  }
};

const keys = <O, K extends (keyof O)[]>(obj: O): K => {
  if (isObject(obj)) {
    return Object.getOwnPropertyNames(obj) as K;
  } else {
    return Object.keys(obj) as K;
  }
};

function defineProperties<O, R>(obj: Computable<O>, root?: R): O {
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
        configurable: false,
        enumerable: true
      });
      continue;
    }

    if (Array.isArray(value) || isObject(value)) {
      Object.defineProperty(next, key, {
        value: defineProperties(value, root),
        configurable: false,
        enumerable: true
      });
      continue;
    }

    Object.defineProperty(next, key, {
      value,
      configurable: false,
      enumerable: true
    });
  }

  return next as O;
}

export const deepComputed = <O>(obj: Computable<O>): O =>
  defineProperties<O, O>(obj);

export default deepComputed;
