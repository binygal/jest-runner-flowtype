const path = require('path');
const FlowtypeRunner = require('../src/FlowtypeRunner');

const emptyCallback = () => {};

describe('jest-runner-flow tests', () => {
  test('running on valid file', () => {
    let status = '';
    const resultHandler = (test, testResults) => {
      [{ status }] = testResults.testResults;
    };
    const result = new FlowtypeRunner().runTests(
      [{ path: path.join(__dirname, '../testFiles/valid.js') }],
      emptyCallback,
      emptyCallback,
      resultHandler,
      emptyCallback,
    );
    return result.then(() => expect(status).toBe('passed'));
  });
  test('running on invalid file', () => {
    let status = '';
    const resultHandler = (test, testResults) => {
      [{ status }] = testResults.testResults;
    };
    const result = new FlowtypeRunner().runTests(
      [{ path: path.join(__dirname, '../testFiles/invalid.js') }],
      emptyCallback,
      emptyCallback,
      resultHandler,
      emptyCallback,
    );
    return result.then(() => expect(status).toBe('failed'));
  });
});
