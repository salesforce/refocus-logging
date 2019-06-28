const Kafka = require('no-kafka');
const logger = require('winston');
const utils = require('../utils');
const debug = require('debug')('refocus-logging');

const clientId = 'consumer-' + process.pid;

// We will supply topics as a comma seperated list of values
const topics = utils.topic;

// FOR LOCALHOST...
// const consumer = new Kafka.SimpleConsumer({
//   idleTimeout: 10,
// });

// FOR HEROKU...
const consumer = new Kafka.SimpleConsumer({
  clientId,
  connectionString: utils.connectionString,
  ssl: {
    cert: utils.sslCert,
    key: utils.sslKey,
  },

  // maxWaitTime: +process.env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS || 100,
  // maxBytes: +process.env.KAFKA_CONSUMER_MAX_BYTES || (1024 * 1024),
  // idleTimeout: +process.env.KAFKA_CONSUMER_IDLE_TIMEOUT || 1000,
});

logger.debug(`Kafka consumer ${clientId} has been started`);
debug('Kafka Consumer %s %o', clientId, consumer);

consumer.init();

// Construct an object that has a list of all topics as
// keys and accordingly you can give it a handler
const topicsHandler = topics.reduce((obj, topic) => {
  obj[topic] = (handler) => consumer.subscribe(topic, handler);
  return obj;
}, {});

module.exports = {
  topicHandlers,
  testTopicHandler: (handler) => {
    consumer.subscribe(DEFAULT_TOPIC, handler);
  },
};
