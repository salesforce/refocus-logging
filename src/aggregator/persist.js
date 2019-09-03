const featureToggles = require('feature-toggles');

const persist = (parsedKey, val) => {
  if (featureToggles.isFeatureEnabled('logPubSubStats')) {
    logger.info(parsedKey);
    logger.info(val);
  }
};

module.exports = {
  persist,
};
