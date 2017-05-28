import { deepComputed } from './index';

describe('deepComputed', () => {
  it('defines properties on an object', () => {
    const obj = {
      a: 12,
      b: 10
    };

    const next = deepComputed(obj);

    expect(next).not.toBe(obj);
    expect(Object.keys(next)).toHaveLength(0);
  });

  it('resolves computed properties', () => {
    const obj = {
      a: 12,
      b: 10,
      c: ({ a, b }) => a + b,
      d: {
        e: ({ a, c }) => a + c
      },
      f: [({ a, d }) => a + d.e, ({ a }) => a + 1]
    };

    type Next = {
      a: number;
      b: number;
      c: number;
      d: {
        e: number;
      },
      f: number[]
    }

    const next = deepComputed<typeof obj, Next>(obj);

    expect(next.c).toEqual(22);
    expect(next.d.e).toEqual(34);
    expect(next.f[0]).toEqual(46);

    let sum = 0;

    for (let val of next.f) {
      sum += val;
    }

    expect(sum).toEqual(59);
  });

  it('enumerates over arrays', () => {
    const obj = [() => 1, () => 2];

    const next = deepComputed<typeof obj, number[]>(obj);

    let sum = 0;

    for (let val of next) {
      sum += val;
    }

    expect(sum).toEqual(3);
  });
});