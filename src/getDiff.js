import _ from 'lodash';

const getDiffStatus = (data1, data2, key) => {
  if (_.isObject(data1[key]) && _.isObject(data2[key])) {
    return 'nested';
  }
  if (!(_.has(data1, key)) && _.has(data2, key)) {
    return 'added';
  }
  if (_.has(data1, key) && !(_.has(data2, key))) {
    return 'deleted';
  }
  if (data1[key] === data2[key]) {
    return 'unchanged';
  }
  return 'changed';
};

const getValue = (data1, data2, key, status) => {
  switch (status) {
    case 'nested':
      // eslint-disable-next-line no-use-before-define
      return { children: getDiffTree(data1[key], data2[key]) };
    case 'added':
      return { value: data2[key] };
    case 'deleted':
      return { value: data1[key] };
    case 'unchanged':
      return { value: data1[key] };
    case 'changed':
      return { value1: data1[key], value2: data2[key] };
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

const getDiffTree = (data1, data2) => {
  const keys = _.union(_.keys(data1), _.keys(data2));
  const sortedKeys = _.sortBy(keys);

  return sortedKeys.map((key) => {
    const status = getDiffStatus(data1, data2, key);
    return { status, key, ...getValue(data1, data2, key, status) };
  });
};

export default getDiffTree;
