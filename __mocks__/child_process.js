// mock for child_process. If the invalid file is called
// the result would be an error.

module.exports = {
  exec: (cmd, cb) => {
    if (cmd.includes('invalid')) {
      return cb({ err: 'this is error' }, 'There is error');
    }
    return cb(null, 'stdout sample');
  },
};
