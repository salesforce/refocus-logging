/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
/**
 * src/handlerUtil.js
 * Kafka handler utilities
 */

const logger = require('pino')();

// The default handler just logs out the message
const defaultHandler = (messageSet, topic, partition) => {
  let messageSetOutput = '';
  messageSet.forEach((m) => {
    const key = m.message.key;
    const value = m.message.value;
    logger.info('Message from topic', topic, key, value);
    messageSetOutput += 'Message from topic ' + topic + ' ' + key + ' ' + value;
  });
  return messageSetOutput;
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
