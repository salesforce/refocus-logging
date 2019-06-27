const KafkaProducer = require('no-kafka');

console.log('KAFKA entered kafkaProducer.js');

// LOCALHOST...
const producer = new KafkaProducer.Producer();

// Heroku
const producer = new KafkaProducer.Producer({
  connectionString: process.env.KAFKA_URL,
  ssl: {
    cert: process.env.KAFKA_CLIENT_CERT || '.ssl/client.crt',
    key: process.env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  },
});

producer.init();

module.exports = {
  sendPing: (key, value) => producer.send({
    topic: 'ping',
    partition: 0,
    message: {
      key,
      value: JSON.stringify(value),
    },
  }).then((res) => console.log('kafkaProducer|Sent|%o', res)),
};

