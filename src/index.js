import { readFileSync } from 'fs';
import { extname } from 'path';
import parse from './parsers';
import calcDiff from './diff-ast';
import render from './renderers';

const getFileType = filePath => extname(filePath).toLowerCase().slice(1);

const createDiff = (before, after, format) => {
  const beforeType = getFileType(before);
  const afterType = getFileType(after);
  const beforeRawData = readFileSync(before, 'utf-8');
  const afterRawData = readFileSync(after, 'utf-8');
  const beforeObject = parse(beforeRawData, beforeType);
  const afterObject = parse(afterRawData, afterType);
  return render(calcDiff(beforeObject, afterObject), format);
};

export default createDiff;
