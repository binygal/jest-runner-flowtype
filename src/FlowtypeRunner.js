const { exec } = require('child_process');
const path = require('path');
const { pass, fail } = require('create-jest-runner');

class FlowtypeRunner {
  constructor(globalConfig) {
    this.globalConfig = globalConfig;
  }

  runTests(tests, watcher, onStart, onResult, onFailure, options) {
    this.globalConfig = {};
    const start = +new Date();
    return new Promise((resolve) => {
      exec('flow', { stdio: 'ignore', cwd: process.cwd() }, (err, stdout) => {
        const errors = stdout.split('Error');
        const errorsPerFile = errors.reduce((previous, current) => {
          const firstErrorLine = current.split('\n')[0];
          let fileName = firstErrorLine.split(':')[1];
          if (fileName) {
            fileName = path.join(process.cwd(), fileName.trim());
            const errorMessage = current.substring(current.indexOf('\n') + 1);
            if (!previous[fileName]) {
              previous[fileName] = [];
            }
            previous[fileName].push(errorMessage);
          }
          return previous;
        }, {});
        tests.map((t) => {
          if (!errorsPerFile[t.path]) {
            const testResults = pass({ start, end: +new Date(), test: { path: t.path } });
            onResult(t, testResults);
          } else {
            const testResults = fail({
              start,
              end: +new Date(),
              test: { path: t.path, errorMessage: errorsPerFile[t.path] },
            });
            onResult(t, testResults);
          }
        });
        resolve();
      });
    });
  }
}

module.exports = FlowtypeRunner;
