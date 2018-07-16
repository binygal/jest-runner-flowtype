const { exec } = require('child_process');
const path = require('path');
const { pass, fail } = require('create-jest-runner');

class FlowtypeRunner {
  constructor(globalConfig) {
    this.globalConfig = globalConfig;
  }

  runTests(tests, watcher, onStart, onResult) {
    const start = +new Date();
    return new Promise((resolve) => {
      exec('flow', { stdio: 'ignore', cwd: process.cwd() }, (err, stdout) => {
        const errors = stdout.split('Error');
        const errorsPerFile = errors.reduce((previous, current) => {
          const firstErrorLine = current.split('\n')[0];
          const fileNameMatcher = firstErrorLine.match(/(\.{1,2}|\/)?([A-z]|\/|-|\.)*\.js(x?)/);
          if (fileNameMatcher) {
            const fileName = path.join(process.cwd(), fileNameMatcher[0]);
            const errorMessage = current.substring(current.indexOf('\n') + 1);
            if (!previous[fileName]) {
              previous[fileName] = [];
            }
            previous[fileName].push(errorMessage);
          }
          return previous;
        }, {});
        tests.forEach((t) => {
          let testResults;
          if (errorsPerFile[t.path]) {
            testResults = fail({
              start,
              end: +new Date(),
              test: { path: t.path, errorMessage: errorsPerFile[t.path] },
            });
          } else {
            testResults = pass({ start, end: +new Date(), test: { path: t.path } });
          }
          onResult(t, testResults);
        });
        resolve();
      });
    });
  }
}

module.exports = FlowtypeRunner;
