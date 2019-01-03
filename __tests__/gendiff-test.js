import path from 'path';
import { readFileSync } from 'fs';
import createDiff from '../src';

test.each([
  ['before.json', 'after.json', 'b-a-diff.txt'],
  ['before.yaml', 'after.yaml', 'b-a-diff.txt'],
  ['before.yaml', 'after.YML', 'b-a-diff.txt'],
  ['.beforerc', 'after.yaml', 'b-a-diff.txt'],
  ['before.ini', 'after.ini', 'b-a-diff.txt'],
  ['nested-before.json', 'nested-after.json', 'nested-b-a-diff.txt'],
  ['nested-before.yaml', 'nested-after.yaml', 'nested-b-a-diff.txt'],
  ['nested-before.ini', 'nested-after.ini', 'nested-b-a-diff.txt'],
  ['nested-before.json', 'nested-after.json', 'nested-b-a-diff.plain.txt'],
  ['nested-before.yaml', 'nested-after.yaml', 'nested-b-a-diff.plain.txt'],
  ['nested-before.ini', 'nested-after.ini', 'nested-b-a-diff.plain.txt'],
])('test %s and %s difference',
  (before, after, expected) => {
    const fixtureDir = '__tests__/__fixtures__';
    const beforePath = path.join(fixtureDir, before);
    const afterPath = path.join(fixtureDir, after);
    const format = path.basename(expected, 'txt').split('.')[1] || 'pretty';
    const expectedData = readFileSync(path.join(fixtureDir, expected), 'utf-8');
    expect(createDiff(beforePath, afterPath, format)).toBe(expectedData);
  });
