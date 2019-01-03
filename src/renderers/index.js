import { has } from 'lodash';
import plainRenderer from './plain';
import prettyRenderer from './pretty';

export const defaultRenderer = 'pretty';
export const rendererSelector = {
  [defaultRenderer]: prettyRenderer,
  plain: plainRenderer,
  json: JSON.stringify,
};

export default format => (has(rendererSelector, format)
  ? rendererSelector[format] : rendererSelector[defaultRenderer]);
