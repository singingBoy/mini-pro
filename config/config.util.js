import { resolve, parse, join } from 'path';
import glob from 'glob';

function handelFiles(pattern) {
  const paths = glob.sync(pattern) || [];
  return paths.map(filePath => ({
    ...parse(filePath),
    path: resolve(filePath),
  }));
}

export const entry = function () {
  const entryObj = {};
  handelFiles('src/**/*.js').forEach(({dir, path}) => entryObj[dir] = path);
  return entryObj;
};
