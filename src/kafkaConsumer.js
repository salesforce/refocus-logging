const Kafka = require('no-kafka');
const logger = require('winston');


const clientId = 'consumer-' + process.pid;


// We will supply topics as a comma seperated list of values
const topics = process.env.TOPICS ? process.env.TOPICS.split(', ') : [DEFAULT_TOPIC];

// FOR LOCALHOST...
// const consumer = new Kafka.SimpleConsumer({
//   idleTimeout: 10,
// });

// FOR HEROKU...
const consumer = new Kafka.SimpleConsumer({
  clientId,
  connectionString: process.env.KAFKA_URL.replace(/\+ssl/g, ''),
  ssl: {
    cert: process.env.KAFKA_CLIENT_CERT || '.ssl/client.crt',
    key: process.env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  },

  // maxWaitTime: +process.env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS || 100,
  // maxBytes: +process.env.KAFKA_CONSUMER_MAX_BYTES || (1024 * 1024),
  // idleTimeout: +process.env.KAFKA_CONSUMER_IDLE_TIMEOUT || 1000,
});

console.log(`Kafka consumer ${clientId} has been started`);

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
