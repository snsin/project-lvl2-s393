import { flatten } from 'lodash';

const getKeyIndent = level => `${' '.repeat(4 * level + 2)}`;
const getBraceIndent = level => `${' '.repeat(4 * (level + 1))}`;

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

const renderTree = (tree, indentLevel = 0) => {
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
        children.map(child => renderTree(child, indentLevel + 1)),
        `${getBraceIndent(indentLevel)}}`,
      ]).join('\n');
    default:
      throw new Error('Unexpected node type');
  }
};

export default tree => ['{', ...tree.map(child => renderTree(child, 0)), '}'].join('\n');
