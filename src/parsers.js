import { has } from 'lodash';
import yamlParser from 'js-yaml';

const selector = {
  yaml: yamlParser.safeLoad,
  yml: yamlParser.safeLoad,
  json: JSON.parse,
};
const parse = (data, type = 'json') => {
  const decode = (has(selector, type)) ? selector[type] : selector.json;
  return decode(data);
};

export default parse;
