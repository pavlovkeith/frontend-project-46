import parseFile from './parser.js';

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);

  // Здесь будет логика сравнения и форматирования
  return `Comparing ${filepath1} and ${filepath2} with format: ${format}`;
};

export default genDiff;
