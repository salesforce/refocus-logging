const Kafka = require('no-kafka');
const logger = require('pino')();
const handler = require('./handler');
const debug = require('debug')('refocus-logging');
const config = require('./config.env')();

const clientId = 'consumer-' + process.pid;

debug('The config is', config);

const initConsumer = () => {
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

  consumer.init();
  debug(`Kafka consumer ${clientId} has been started as ${consumer}`);

  // Construct an object that has a list of all topics as
  // keys and accordingly you can give it a handler
  const topicHandlers = config.topics.reduce((obj, topic) => {
    obj[topic] = (handler) => {
      try {
        consumer.subscribe(topic, handler);
      } catch (err) {
        // TODO: Not use console.error and still make it testable as of now testing
        // calls to pino seems untestable
        console.error(`Unable to subscribe to topic ${topic}, error ${err}`);
      }
    };

    return obj;
  }, {});
  let topic;
  for (topic in topicHandlers) {
    topicHandlers[topic](handler(topic));
  }

  return {
    topicHandlers,
    consumer,
  };
};

module.exports = {
  initConsumer,
};
