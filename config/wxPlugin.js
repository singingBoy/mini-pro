import glob from 'glob';
import {resolve, parse, join} from 'path';
import fs from 'fs';

const pluginName = 'WxPlugin';
export default class WxPlugin {
  constructor() {
  }
  apply(compiler) {
    const { context } = compiler;
    console.log(resolve(`${context}/src`));
    compiler.hooks.beforeRun.tapAsync(pluginName, (compilation, callback) => {
      console.log(allSrcFiles(context))
    });
    compiler.hooks.run.tap(pluginName, compilation => {
      console.log('WxPlugin starting...');
    });
    compiler.hooks.compile.tap(pluginName, compilation => {
      console.log('compile');

    });
    compiler.hooks.watchRun.tap(pluginName, () => {
      console.log('watch-run')
    });
    compiler.hooks.emit.tap(pluginName, () => {
      console.log('emit')
    });
    compiler.hooks.afterEmit.tap(pluginName, () => {
      console.log('after-emit')
    });
  }
}

function allSrcFiles(context) {
  const srcPath = resolve(`${context}/src`);
  const filesPath = [];
  function traverseFiles(path){
    let files = fs.readdirSync(path);
    files.forEach( item =>{
      let fPath = join(path, item);
      let stat = fs.statSync(fPath);
      if(stat.isDirectory() === true) {
        traverseFiles(fPath);
      }
      if (stat.isFile() === true) {
        filesPath.push(fPath);
      }
    });
  }
  traverseFiles(srcPath);
  return filesPath;
}