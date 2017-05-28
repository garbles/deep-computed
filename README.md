# deep-computed

_Iterates over plain objects and arrays and transforms functions to computed properties_

# Use

If an object or array has a function as a value, it will be wrapped by `Object.defineProperty`
and its getter will pass the root object to it as an argument to resolve the value of the function.
For example,

```js
import { deepComputed } from './deepComputed';

const obj = {
  cool: 123,
  dude: 456,
  deep: {
    ly: {
      nested: {
        coolAndDude: ({cool, dude}) => cool + dude
      }
    }
  }
};

const next = deepComputed(obj);

console.log(next.deep.ly.nested.coolAndDude);
// => 579
```

# Install

```
yarn install deep-computed
```