// The default handler just logs out the message
const defaultHandler = (messageSet, topic, partition) => {
  messageSet.forEach((m) => {
    const key = m.message.key;
    const value = m.message.value;
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
const specialHandlers = () => ({

});

module.exports = {
  specialHandlers,
  defaultHandler,
};
