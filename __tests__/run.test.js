const path = require('path');
const runner = require('../run');

const exec = command => console.log(command);

// child_process.exec = jest.fn(exec);
jest.mock('child_process');

describe('jest-runner-flow tests', () => {
  test('running on valid file', () => {
    const result = runner({ testPath: path.join(__dirname, '../testFiles/valid.js') });
    return result.then(data => expect(data.testResults[0].status).toBe('passed'));
  });
  test('running on invalid file', () => {
    const result = runner({ testPath: path.join(__dirname, '../testFiles/invalid.js') });
    return result.then(data => expect(data.testResults[0].status).toBe('failed'));
  });
});
