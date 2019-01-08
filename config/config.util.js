import {resolve, parse, join} from 'path';
import glob from 'glob';
import {readJsonSync} from 'fs-extra';

export const PAGE_SOURCE = 'src/pages';
export const OUTPUT = 'dist';

export default class BuildUtils {
  constructor() {
    this.pages = getBase();
    // this.entry = this.getEntry();
  }

  getEntry() {
    const allJsPath = handelFiles(`${PAGE_SOURCE}/**/*.js`);

  }
}

function getBase() {
  const appJsonPath = glob.sync(`src/app.json`)[0];
  const {pages = [], subpackages = [], usingComponents = {}} = readJsonSync(appJsonPath);

  return [
    'app',
    ...usingComponents,
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