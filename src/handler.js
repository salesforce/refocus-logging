const logger = require('pino')();

// The default handler just logs out the message
const defaultHandler = (messageSet, topic, partition) => {
  messageSet.forEach((m) => {
    const key = m.message.key.toString();
    const value = JSON.parse(m.message.value.toString());
    logger.info('Message from topic', topic, key, value);
  });
};

/*
  Populate this as required
  FORMAT:
  {
    topic: () => {handler function},
  }
*/
const specialHandlers = {
};

module.exports = (topic) => specialHandlers[topic] ? specialHandlers[topic] : defaultHandler;
