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
  foo: () => {},
};

const getConfig = (env) => ({
  topics: env.TOPICS.split(',').map((string) => string.trim()),
  sslCert: env.KAFKA_CLIENT_CERT || '.ssl/client.crt',
  sslKey: env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  connectionString: env.KAFKA_URL.replace(/\+ssl/g, ''),
  maxWaitTime: env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS || 100,
  maxBytes: env.KAFKA_CONSUMER_MAX_BYTES || (1024 * 1024),
  idleTimeout: env.KAFKA_CONSUMER_IDLE_TIMEOUT || 1000,
});

module.exports = {
  getConfig,
  defaultHandler,
  specialHandlers,
};
