import { readFileSync } from 'fs';
import { extname } from 'path';
import { has } from 'lodash';
import parse from './parsers';
import calcDiff from './diff-ast';
import plainRenderer from './renderers/plain';
import prettyRenderer from './renderers/pretty';

export const defaultRenderer = 'pretty';
export const rendererSelector = {
  [defaultRenderer]: prettyRenderer,
  plain: plainRenderer,
};

const selectRenderer = format => (has(rendererSelector, format)
  ? rendererSelector[format] : rendererSelector[defaultRenderer]);

const getFileType = filePath => extname(filePath).toLowerCase().slice(1);

const createDiff = (before, after, format) => {
  const beforeType = getFileType(before);
  const afterType = getFileType(after);
  const beforeRawData = readFileSync(before, 'utf-8');
  const afterRawData = readFileSync(after, 'utf-8');
  const beforeObject = parse(beforeRawData, beforeType);
  const afterObject = parse(afterRawData, afterType);
  const render = selectRenderer(format);
  return render(calcDiff(beforeObject, afterObject));
};

export default createDiff;
