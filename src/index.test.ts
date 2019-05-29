import { deepComputed, Computable } from "./index";

describe("deepComputed", () => {
  it("defines properties on an object", () => {
    const obj = {
      a: 12,
      b: 10
    };

    const next = deepComputed(obj);

    expect(next).not.toBe(obj);
    expect(Object.keys(next)).toHaveLength(2);
  });

  it("resolves computed properties", () => {
    type Next = {
      a: number;
      b: number;
      c: number;
      d: {
        e: number;
      };
      f: number[];
    };

    const obj: Computable<Next> = {
      a: 12,
      b: 10,
      c: ({ a, b }) => a + b,
      d: {
        e: ({ a, c }) => a + c
      },
      f: [({ a, d }) => a + d.e, ({ a }) => a + 1]
    };

    const next = deepComputed(obj);

    expect(next).toEqual({
      a: 12,
      b: 10,
      c: 22,
      d: {
        e: 34
      },
      f: [46, 13]
    });

    const next2 = deepComputed({
      ...obj,
      a: 50
    } as Computable<Next>);

    expect(next2).toEqual({
      a: 50,
      b: 10,
      c: 60,
      d: {
        e: 110
      },
      f: [160, 51]
    });
  });

  it("enumerates over arrays", () => {
    const obj: Computable<[number, number]> = [() => 1, arr => arr[0] + 1];

    const next = deepComputed(obj);

    expect(next).toEqual([1, 2]);
  });
});
