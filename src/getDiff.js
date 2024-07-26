import _ from 'lodash';

const getDiffStatus = (data1, data2, key) => {
  const value1 = data1[key];
  const value2 = data2[key];
  const hasValue1 = _.has(data1, key);
  const hasValue2 = _.has(data2, key);

  if (_.isObject(value1) && _.isObject(value2)) {
    return 'nested';
  }
  if (!hasValue1 && hasValue2) {
    return 'added';
  }
  if (hasValue1 && !hasValue2) {
    return 'deleted';
  }
  if (value1 === value2) {
    return 'unchanged';
  }
  return 'changed';
};

const getDiffNode = (data1, data2, key) => {
  const value1 = data1[key];
  const value2 = data2[key];
  const status = getDiffStatus(data1, data2, key);

  switch (status) {
    case 'nested':
      // eslint-disable-next-line no-use-before-define
      return { status, key, children: getDiffTree(value1, value2) };
    case 'added':
      return { status, key, value: value2 };
    case 'deleted':
      return { status, key, value: value1 };
    case 'unchanged':
      return { status, key, value: value1 };
    case 'changed':
      return {
        status, key, value1, value2,
      };
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

const getDiffTree = (data1, data2) => {
  const keys = _.union(_.keys(data1), _.keys(data2));
  const sortedKeys = _.sortBy(keys);

  return sortedKeys.map((key) => getDiffNode(data1, data2, key));
};

export default getDiffTree;
