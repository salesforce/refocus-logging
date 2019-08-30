const persist = (parsedKey, val) => {
  logger.info(parsedKey);
  logger.info(val);
};

module.exports = {
  persist,
};
