const logger = require('pino')();

// The default handler just logs out the message
const defaultHandler = (messageSet, topic, partition) => {
  messageSet.forEach((m) => {
    const key = m.message.key.toString();
    const value = JSON.parse(m.message.value.toString());
    logger.info('Message from topic', topic, key, value);
  });
};

// Populate this as required
const specialHandlers = {
};

const testEnv =  {
  TOPICS: 'foo,bar',
  KAFKA_CLIENT_CERT: 'test-cert',
  KAFKA_CLIENT_CERT_KEY: 'test-key',
  KAFKA_URL: 'test-url',
  KAFKA_CONSUMER_MAX_WAIT_TIME_MS: 100,
  KAFKA_CONSUMER_MAX_BYTES: (1024 * 1024),
  KAFKA_CONSUMER_IDLE_TIMEOUT: 1000,
};

const getConfigHelper = (env) => ({
  topics: env.TOPICS.split(',').map((string) => string.trim()),
  sslCert: env.KAFKA_CLIENT_CERT || '.ssl/client.crt',
  sslKey: env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  connectionString: env.KAFKA_URL.replace(/\+ssl/g, ''),
  maxWaitTime: env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS || 100,
  maxBytes: env.KAFKA_CONSUMER_MAX_BYTES || (1024 * 1024),
  idleTimeout: env.KAFKA_CONSUMER_IDLE_TIMEOUT || 1000,
});

const getConfig = () => {
  if (process.env.IS_HEROKU) {
    return getConfigHelper(process.env);
  }

  return getConfigHelper(testEnv);
};

module.exports = {
  getConfig,
  defaultHandler,
  specialHandlers,
};
