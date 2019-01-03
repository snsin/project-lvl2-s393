import { flatten, has } from 'lodash';

const getKeyIndent = level => `${' '.repeat(4 * level + 2)}`;
const getBraceIndent = level => `${' '.repeat(4 * (level + 1))}`;

const getKeyView = (parentKey, key) => (parentKey ? `${parentKey}.${key}` : `${key}`);
const getValView = (val) => {
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  if (val instanceof Object) {
    return '[complex value]';
  }
  return val;
};

const stringify = (val, indentLevel) => {
  if (val instanceof Object) {
    const braceIndent = getBraceIndent(indentLevel);
    const keyIndent = getBraceIndent(indentLevel + 1);
    return flatten([
      '{',
      Object.keys(val).map(k => `${keyIndent}${k}: ${stringify(val[k], indentLevel + 1)}`),
      `${braceIndent}}`,
    ]).join('\n');
  }
  return val;
};

const renderPretty = (tree, indentLevel = 0) => {
  const keyIndent = getKeyIndent(indentLevel);
  const { key, type, children } = tree;
  switch (type) {
    case 'unchanged':
      return `${keyIndent}  ${key}: ${stringify(tree.value, indentLevel)}`;
    case 'deleted':
      return `${keyIndent}- ${key}: ${stringify(tree.value, indentLevel)}`;
    case 'added':
      return `${keyIndent}+ ${key}: ${stringify(tree.value, indentLevel)}`;
    case 'changed':
      return [
        `${keyIndent}- ${key}: ${stringify(tree.oldValue, indentLevel)}`,
        `${keyIndent}+ ${key}: ${stringify(tree.newValue, indentLevel)}`,
      ].join('\n');
    case 'nested':
      return flatten([
        `${keyIndent}  ${key}: {`,
        children.map(child => renderPretty(child, indentLevel + 1)),
        `${getBraceIndent(indentLevel)}}`,
      ]).join('\n');
    default:
      throw new Error('Unexpected node type');
  }
};

const renderPlain = (tree, parentKey = '') => {
  const { key, type } = tree;
  const property = getKeyView(parentKey, key);
  switch (type) {
    case 'changed':
      return [
        `Property '${property}' was updated.`,
        `From ${getValView(tree.oldValue)} to ${getValView(tree.newValue)}`,
      ].join(' ');

    case 'added':
      return `Property '${property}' was added with value: ${getValView(tree.value)}`;

    case 'deleted':
      return `Property '${property}' was removed`;

    case 'unchanged':
      return '';

    case 'nested':
      return flatten(tree.children.map(child => renderPlain(child, property)))
        .filter(v => v)
        .join('\n');

    default:
      throw new Error('Unexpected node type');
  }
};

export const defaultRenderer = 'pretty';
export const rendererSelector = {
  [defaultRenderer]: tree => [
    '{',
    ...tree.map(child => renderPretty(child, 0)),
    '}',
  ].join('\n'),
  plain: tree => tree.map(node => renderPlain(node, '')).join('\n'),
};

export default (data, format) => {
  const render = has(rendererSelector, format)
    ? rendererSelector[format] : rendererSelector[defaultRenderer];
  return render(data);
};
