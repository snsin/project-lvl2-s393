import { union, has } from 'lodash';
import { readFileSync } from 'fs';
import { extname } from 'path';
import parse from './parsers';

const beforeView = (key, value) => `  - ${key}: ${value}`;
const afterView = (key, value) => `  + ${key}: ${value}`;
const unchgView = (key, value) => `    ${key}: ${value}`;

const diffCalc = (k, b, a) => {
  if (!has(b, k)) {
    return afterView(k, a[k]);
  }
  if (!has(a, k)) {
    return beforeView(k, b[k]);
  }
  if (b[k] === a[k]) {
    return unchgView(k, b[k]);
  }
  return [afterView(k, a[k]), beforeView(k, b[k])].join('\n');
};

const getFileType = filePath => extname(filePath).toLowerCase().slice(1);

const diff = (before, after) => {
  const beforeType = getFileType(before);
  const afterType = getFileType(after);
  const beforeRawData = readFileSync(before, 'utf-8');
  const afterRawData = readFileSync(after, 'utf-8');
  const beforeObject = parse(beforeRawData, beforeType);
  const afterObject = parse(afterRawData, afterType);
  const diffStr = union(Object.keys(beforeObject), (Object.keys(afterObject)))
    .map(k => diffCalc(k, beforeObject, afterObject));
  return ['{', ...diffStr, '}'].join('\n');
};

export default diff;
