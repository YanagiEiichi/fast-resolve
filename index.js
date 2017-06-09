const DEFAULT_SUCCESS_HANDLER = value => value;
const DEFAULT_REJECT = error => { throw error; }

const fastResolveAll = (args, success, failure) => {
  if (typeof success !== 'function') success = DEFAULT_SUCCESS_HANDLER;
  let results = [];
  let length = args.length;
  let inc = 0;
  let resolve;
  let reject = DEFAULT_REJECT;
  for (let i = 0; i < length; i++) {
    results[i] = fastResolve(args[i], value => {
      results[i] = value;
      inc++;
      if (resolve && inc === length) {
        try {
          resolve(success(results));
        } catch (error) {
          reject(error);
        }
      }
      return value;
    }, error => {
      if (failure) {
        try {
          let result = failure(error);
          if (resolve) {
            resolve(result);
          } else {
            return result;
          }
        } catch (newError) {
          error = newError;
        }
      }
      reject(error);
    });
  }
  if (inc === length) {
    return success(results);
  } else {
    return new Promise((...args) => ([ resolve, reject ] = args));
  }
};

const fastResolve = (what, success, failure) => {
  if (typeof success !== 'function') success = DEFAULT_SUCCESS_HANDLER;
  return what && typeof what.then === 'function' ? what.then(success, failure) : success(what);
};

module.exports = { fastResolve, fastResolveAll };
