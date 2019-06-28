const logger = require('winston');

const DEFAULT_TOPIC = 'cimarron-86176.ping';

// The default handler just logs out the message
const defaultHandler = (messageSet, topic, partition) => {
  messageSet.forEach((m) => {
    const key = m.message.key.toString();
    const value = JSON.parse(m.message.value.toString());
    logger.info('Message from topic', topic, key, value);
  });
};