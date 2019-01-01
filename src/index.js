import { union, has } from 'lodash';
import { readFileSync } from 'fs';
import { extname } from 'path';
import parse from './parsers';

const getBeforeView = (key, value) => `  - ${key}: ${value}`;
const getAfterView = (key, value) => `  + ${key}: ${value}`;
const getUnchgView = (key, value) => `    ${key}: ${value}`;

const calcDiff = (k, b, a) => {
  if (!has(b, k)) {
    return getAfterView(k, a[k]);
  }
  if (!has(a, k)) {
    return getBeforeView(k, b[k]);
  }
  if (b[k] === a[k]) {
    return getUnchgView(k, b[k]);
  }
  return [getAfterView(k, a[k]), getBeforeView(k, b[k])].join('\n');
};

const getFileType = filePath => extname(filePath).toLowerCase().slice(1);

const createDiff = (before, after) => {
  const beforeType = getFileType(before);
  const afterType = getFileType(after);
  const beforeRawData = readFileSync(before, 'utf-8');
  const afterRawData = readFileSync(after, 'utf-8');
  const beforeObject = parse(beforeRawData, beforeType);
  const afterObject = parse(afterRawData, afterType);
  const diffStr = union(Object.keys(beforeObject), (Object.keys(afterObject)))
    .map(k => calcDiff(k, beforeObject, afterObject));
  return ['{', ...diffStr, '}'].join('\n');
};

export default createDiff;
