const logger = require('winston');

const DEFAULT_TOPIC = 'cimarron-86176.ping';

const topics = process.env.TOPICS ? process.env.TOPICS.split(', ') : [DEFAULT_TOPIC];

const sslCert = process.env.KAFKA_CLIENT_CERT || '.ssl/client.crt';
const sslKey = process.env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key';
const connectionString = process.env.KAFKA_URL.replace(/\+ssl/g, '');

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
