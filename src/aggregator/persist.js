const featureToggles = require('feature-toggles');
const { db, aggregateTableName } = require('./db');
const logger = require('pino')();

const persist = async (parsedKey, val) => {
  if (featureToggles.isFeatureEnabled('logPubSubStats')) {
    logger.info(parsedKey);
    logger.info(val);
  }

  const epochSampleTime = Date.parse(parsedKey.updatedAt);
  const sampleName = parsedKey.name;
  const {
    jobStartTime,
    queueTime,
    publishLatency,
    avgSubscribeLatency,
    numSubsMissed,
    avgEndToEndLatency,
    medianEndToEndLatency,
    ninetyFifthPercentileEndToEndLatency,
    isPublished,
    isSuccessfullyEmitted,
    numClientsAcknowledged,
    numClientsEmittedTo,
  } = val;

  const dbLine = `${epochSampleTime}, '${sampleName}', ${jobStartTime}, ${queueTime},
    ${publishLatency}, ${avgSubscribeLatency}, ${numSubsMissed}, ${avgEndToEndLatency},
    ${medianEndToEndLatency}, ${ninetyFifthPercentileEndToEndLatency}, ${isPublished},
    ${isSuccessfullyEmitted}, ${numClientsEmittedTo}, ${numClientsAcknowledged}`;

  logger.info('The key updated_at, sampleName is:' + epochSampleTime + ', ' + sampleName);

  try {
    const res = await db.query(`INSERT INTO ${aggregateTableName} (updated_at, sample_name,
      job_start_time, queue_time, publish_latency, avg_subscribe_latency, num_subs_missed,
      avg_end_to_end_latency, median_end_to_end_latency,
      ninety_fifth_percentile_end_to_end_latency, is_published, is_successfully_emitted,
      num_clients_emitted_to, num_clients_acknowledged)
    VALUES (${dbLine});`);
    return res;
  } catch (e) {
    logger.info(`Insert failed ${e}`);
  }
};

module.exports = {
  persist,
};
