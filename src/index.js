import _ from 'lodash';
import parseFile from '../src/parser.js';

const buildDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(_.keys(data1), _.keys(data2)));

  return keys.map((key) => {
    if (!_.has(data2, key)) {
      return { key, type: 'removed', value: data1[key] };
    }
    if (!_.has(data1, key)) {
      return { key, type: 'added', value: data2[key] };
    }
    const value1 = data1[key];
    const value2 = data2[key];
    if (_.isObject(value1) && _.isObject(value2)) {
      return { key, type: 'nested', children: buildDiff(value1, value2) };
    }
    if (value1 !== value2) {
      return {
        key,
        type: 'changed',
        oldValue: value1,
        newValue: value2,
      };
    }
    return { key, type: 'unchanged', value: value1 };
  });
};

const formatStylish = (diff, depth = 1) => {
  const indent = ' '.repeat(depth * 4 - 2);
  const indentClose = ' '.repeat((depth - 1) * 4);

  const stringify = (value, depth) => {
    if (!_.isObject(value)) {
      return value;
    }

    const indent = ' '.repeat(depth * 4);
    const closingIndent = ' '.repeat((depth - 1) * 4);

    const entries = Object.entries(value).map(
      ([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`,
    );

    return `{\n${entries.join('\n')}\n${closingIndent}}`;
  };

  const formattedDiff = diff.map((item) => {
    switch (item.type) {
      case 'removed':
        return `${indent}- ${item.key}: ${stringify(item.value, depth + 1)}`;
      case 'added':
        return `${indent}+ ${item.key}: ${stringify(item.value, depth + 1)}`;
      case 'changed':
        return `${indent}- ${item.key}: ${stringify(
          item.oldValue,
          depth + 1,
        )}\n${indent}+ ${item.key}: ${stringify(item.newValue, depth + 1)}`;
      case 'nested':
        return `${indent}  ${item.key}: {\n${formatStylish(
          item.children,
          depth + 1,
        )}\n${indent}  }`;
      case 'unchanged':
        return `${indent}  ${item.key}: ${stringify(item.value, depth + 1)}`;
      default:
        throw new Error(`Unknown item type: ${item.type}`);
    }
  });

  return formattedDiff.join('\n');
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);

  const diff = buildDiff(data1, data2);

  if (format === 'stylish') {
    return `{\n${formatStylish(diff)}\n}`;
  }
  throw new Error(`Unknown format: ${format}`);
};

export default genDiff;
