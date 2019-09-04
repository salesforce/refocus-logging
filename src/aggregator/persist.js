const featureToggles = require('feature-toggles');
const { db } = require('./db');

/**
 * Key = {
 *  updatedAt,
 *  name);
 * Value = {
 *    jobStartTime,
 *    queueTime,
 *    publishLatency,
 *    avgSubscribeLatency,
 *    numSubsMissed,
 *    avgEndToEndLatency,
 *    medianEndToEndLatency,
 *    ninetyFifthPercentileEndToEndLatency,
 *    isPublished,
 *    isSuccessfullyEmitted,
 *    numClientsAcknowledged,
 * }
 */
const persist = (parsedKey, val) => {
  if (featureToggles.isFeatureEnabled('logPubSubStats')) {
    logger.info(parsedKey);
    logger.info(val);
  }

  const epochTime = Date.parse(parsedKey.updatedAt);
  const sampleName = parsedKey.name;

  db.query(`INSERT INTO films (code, title, did, date_prod, kind)
  VALUES ('T_601', 'Yojimbo', 106, '1961-06-16', 'Drama');`);
};

module.exports = {
  persist,
};
