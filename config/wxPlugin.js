import fs from 'fs';
import {resolve, parse, join} from 'path';
import MultiEntryPlugin from "webpack/lib/MultiEntryPlugin";

const pluginName = 'WxPlugin';
export default class WxPlugin {
  constructor() {
    this.chunkName = 'common.js';
  }
  apply(compiler) {
    const { context, plugins } = compiler;
    const entries = allSrcFiles(context);
    const multiEntryPlugin = new MultiEntryPlugin(context, entries, this.chunkName);
    compiler.apply(multiEntryPlugin);

    compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
      const entries = allSrcFiles(context);
      const multiEntryPlugin = new MultiEntryPlugin(context, entries, this.chunkName);
      multiEntryPlugin.apply(compiler);
    });

    compiler.hooks.beforeRun.tapAsync(pluginName, (compilation, callback) => {

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