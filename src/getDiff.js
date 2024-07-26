import _ from 'lodash';

const getDiffTree = (data1, data2) => {
  const keys = _.union(_.keys(data1), _.keys(data2));
  const sortedKeys = _.sortBy(keys);

  const getTree = sortedKeys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    const hasValue1 = _.has(data1, key);
    const hasValue2 = _.has(data2, key);

    if (_.isObject(value1) && _.isObject(value2)) {
      return { status: 'nested', key, children: getDiffTree(value1, value2) };
    }
    if (!hasValue1 && hasValue2) {
      return { status: 'added', key, value: value2 };
    }
    if (hasValue1 && !hasValue2) {
      return { status: 'deleted', key, value: value1 };
    }
    if (value1 === value2) {
      return { status: 'unchanged', key, value: value1 };
    }
    return {
      status: 'changed', key, value1, value2,
    };
  });

  return getTree;
};

export default getDiffTree;
