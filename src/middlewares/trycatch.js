/**
 *
 * @param {Function} fn
 * @returns
 */
const tryCatch = fn => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch ({ message }) {
      console.log('message:---------- ', message);
      return res.status(500).json({
        message,
      });
    }
  };
};

module.exports = tryCatch;
