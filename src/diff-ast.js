import { has, union, find } from 'lodash';

const isNested = (b, a, k) => has(b, k) && has(a, k)
  && (b[k] instanceof Object) && (a[k] instanceof Object);

const typeSelector = [
  {
    type: 'nested',
    predicate: (key, before, after) => isNested(before, after, key),
    create: (before, after, fn) => ({ children: fn(before, after) }),
  },
  {
    type: 'added',
    predicate: (key, before, after) => !has(before, key) && has(after, key),
    create: (beforeValue, value) => ({ value }),
  },
  {
    type: 'deleted',
    predicate: (key, before, after) => has(before, key) && !has(after, key),
    create: value => ({ value }),
  },
  {
    type: 'changed',
    predicate: (key, before, after) => has(before, key) && has(after, key)
      && before[key] !== after[key],
    create: (oldValue, newValue) => ({ newValue, oldValue }),
  },
  {
    type: 'unchanged',
    predicate: (key, before, after) => has(before, key) && has(after, key)
      && before[key] === after[key],
    create: value => ({ value }),
  },
];

const calcDiff = (b, a) => {
  const keys = union(Object.keys(b), (Object.keys(a)));
  return keys.map((key) => {
    const { type, create } = find(typeSelector, typeInst => typeInst.predicate(key, b, a));
    return { type, key, ...create(b[key], a[key], calcDiff) };
  });
};

export default calcDiff;
