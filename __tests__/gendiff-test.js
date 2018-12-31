import path from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src';

const getDiffTest = (before, after, expected) => {
  const fixtureDir = '__tests__/__fixtures__';
  const beforePath = path.join(fixtureDir, before);
  const afterPath = path.join(fixtureDir, after);
  const expectedData = readFileSync(path.join(fixtureDir, expected), 'utf-8');
  return () => expect(genDiff(beforePath, afterPath)).toBe(expectedData);
};

test('".confrc"-like config', getDiffTest('.beforerc', 'after.json', 'b-a-diff.txt'));


['.json', '.yaml', '.YML'].forEach(ext => test(`pretty format, plain with ${ext}`, () => {
  const fixtureDir = '__tests__/__fixtures__';
  const beforePath = path.join(fixtureDir, `before${ext}`);
  const afterPath = path.join(fixtureDir, `after${ext}`);
  const expectedData = readFileSync(path.join(fixtureDir, 'b-a-diff.txt'), 'utf-8');
  expect(genDiff(beforePath, afterPath, 'plain')).toBe(expectedData);
}));
