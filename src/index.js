/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const kafkaProducer = require('./kafkaProducer');
const kafkaConsumer = require('./kafkaConsumer');
const debug = require('debug')('refocus-logging');

let i;
for (i = 0; i < 10; i++) {
  setTimeout(() => {
    kafkaProducer.sendPing('key', 'value');
  }, 1000);
};


const clientId = 'consumer-' + process.pid;
kafkaConsumer.subscribe((messageSet, topic, partition) => {
  debug('emitViaKafka|subscribe %s topic=%s partition=%s numMessages=%d',
    clientId, topic, partition, messageSet.length);
  messageSet.forEach((m) => {
    const key = m.message.key.toString();
    const value = JSON.parse(m.message.value.toString());
    console.log(key, value);
  });
});

