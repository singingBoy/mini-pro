import {resolve, parse, join} from 'path';
import glob from 'glob';
import {readJsonSync} from 'fs-extra';

export const SOURCE = 'src';
export const OUTPUT = 'dist';

export default class BuildUtils {
  constructor() {
    this.pages = getBase();
    this.entry = this.getEntry();
  }

  getEntry() {
    const entry = {};
    this.pages.forEach(page => entry[page] = resolve(`${SOURCE}/${page}`));
    return entry;
  }
}

function getBase() {
  const appJsonPath = glob.sync(`${SOURCE}/app.json`)[0];
  const {pages = [], subpackages = []} = readJsonSync(appJsonPath);
  return [
    'app',
    ...pages,
    ...subpackages,
  ];
}

function handelFiles(pattern) {
  const paths = glob.sync(pattern) || [];
  return paths.map(filePath => ({
    ...parse(filePath),
    path: resolve(filePath),
  }));
}