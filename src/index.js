/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const kafkaProducer = require('./kafkaProducer');
const kafkaConsumer = require('./kafkaConsumer');

let i;
for (i = 0; i < 10; i++) {
  setTimeout(() => {
    kafkaProducer.sendPing('key', 'value');
  }, 1000);
};

const clientId = 'consumer-' + process.pid;
kafkaConsumer.subscribe((messageSet, topic) => {
  messageSet.forEach((m) => {
    const key = m.message.key.toString();
    const value = JSON.parse(m.message.value.toString());
    console.log('Message from topic', topic, key, value);
  });
});

