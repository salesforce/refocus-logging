const Kafka = require('no-kafka');
const logger = require('pino')();
const utils = require('./utils');
const debug = require('debug')('refocus-logging');

const clientId = 'consumer-' + process.pid;

// make a mock out of this instance and expect it to be called it with passed in requirements
const config = utils.getConfig(process.env.isHeroku ? process.env : {
  TOPICS: 'foo,bar',
  KAFKA_CLIENT_CERT: 'test-cert',
  KAFKA_CLIENT_CERT_KEY: 'test-key',
  KAFKA_URL: 'test-url',
  KAFKA_CONSUMER_MAX_WAIT_TIME_MS: 100,
  KAFKA_CONSUMER_MAX_BYTES: (1024 * 1024),
  KAFKA_CONSUMER_IDLE_TIMEOUT: 1000,
});
debug('The config is', config);

try {
  const consumer = new Kafka.SimpleConsumer({
    clientId,
    connectionString: config.connectionString,
    ssl: {
      cert: config.sslCert,
      key: config.sslKey,
    },
    maxWaitTime: config.maxWaitTime,
    maxBytes: config.maxBytes,
    idleTimeout: config.idleTimeout,
  });

  debug(`Kafka consumer ${clientId} has been started`);
  debug('Kafka Consumer %s %o', clientId, consumer);

  consumer.init();

  // Construct an object that has a list of all topics as
  // keys and accordingly you can give it a handler
  const topicsHandler = config.topics.reduce((obj, topic) => {
    obj[topic] = (handler) => consumer.subscribe(topic, handler);
    return obj;
  }, {});

  module.exports = {
    topicsHandler,
  };
} catch (err) {
  logger.error(`Could not start consumer with client ID: ${clientId}, error: ${err}`);
}
