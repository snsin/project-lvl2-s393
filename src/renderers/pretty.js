import { flatten, flattenDeep } from 'lodash';

const getKeyIndent = level => `${' '.repeat(4 * level + 2)}`;
const getBraceIndent = level => `${' '.repeat(4 * (level + 1))}`;

const stringify = (val, depth = 0) => {
  if (!(val instanceof Object)) {
    return val;
  }
  const braceIndent = getBraceIndent(depth);
  const keyIndent = getBraceIndent(depth + 1);
  return flatten([
    '{',
    Object.keys(val).map(k => `${keyIndent}${k}: ${stringify(val[k], depth + 1)}`),
    `${braceIndent}}`,
  ]).join('\n');
};

const renderPretty = (tree, depth = 0) => {
  const keyIndent = getKeyIndent(depth);
  const { key, type, children } = tree;
  switch (type) {
    case 'unchanged':
      return `${keyIndent}  ${key}: ${stringify(tree.value, depth)}`;
    case 'deleted':
      return `${keyIndent}- ${key}: ${stringify(tree.value, depth)}`;
    case 'added':
      return `${keyIndent}+ ${key}: ${stringify(tree.value, depth)}`;
    case 'changed':
      return [
        `${keyIndent}- ${key}: ${stringify(tree.oldValue, depth)}`,
        `${keyIndent}+ ${key}: ${stringify(tree.newValue, depth)}`,
      ];
    case 'nested':
      return [
        `${keyIndent}  ${key}: {`,
        children.map(child => renderPretty(child, depth + 1)),
        `${getBraceIndent(depth)}}`,
      ];
    default:
      throw new Error('Unexpected node type');
  }
};

export default data => flattenDeep([
  '{',
  data.map(node => renderPretty(node, 0)),
  '}',
]).join('\n');
