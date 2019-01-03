import { flattenDeep } from 'lodash';

const getValView = (val) => {
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  if (val instanceof Object) {
    return '[complex value]';
  }
  return val;
};

const renderPlain = (tree, parentKey = '') => {
  const { key, type } = tree;
  const property = (parentKey ? `${parentKey}.${key}` : `${key}`);
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
      return tree.children.map(child => renderPlain(child, property));

    default:
      throw new Error('Unexpected node type');
  }
};

export default data => flattenDeep(data.map(node => renderPlain(node, '')))
  .filter(v => v)
  .join('\n');
