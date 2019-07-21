// exporting a function that takes a promise(function that returns a promise) as its argument.
// if the promise resolves it returns an array with null at index[0] and the resolved data
// at index[1] and the reverse if it rejects. now we can avoid using try/catch blocks in async funcs
module.exports = promise => {
  return promise.then(res => [null, res]).catch(err => [err, null]);
};
