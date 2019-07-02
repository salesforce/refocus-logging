console.warn(process.env.NODE_ENV);

const herokuConfig = {
  topics: process.env.TOPICS ? process.env.TOPICS.split(',').map((string) => string.trim()) : '',
  sslCert: process.env.KAFKA_CLIENT_CERT || '.ssl/client.crt',
  sslKey: process.env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  connectionString: process.env.KAFKA_URL ? process.env.KAFKA_URL.replace(/\+ssl/g, '') : '',
  maxWaitTime: process.env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS || 100,
  maxBytes: process.env.KAFKA_CONSUMER_MAX_BYTES || (1024 * 1024),
  idleTimeout: process.env.KAFKA_CONSUMER_IDLE_TIMEOUT || 1000,
};

const integration = {
  topics: ['integration'],
  sslCert: process.env.KAFKA_CLIENT_CERT || '.ssl/client.crt',
  sslKey: process.env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  connectionString: process.env.KAFKA_URL ? process.env.KAFKA_URL.replace(/\+ssl/g, '') : '',
  maxWaitTime: process.env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS || 100,
  maxBytes: process.env.KAFKA_CONSUMER_MAX_BYTES || (1024 * 1024),
  idleTimeout: process.env.KAFKA_CONSUMER_IDLE_TIMEOUT || 1000,
};

const devConfig = {
  topics: ['foo', 'bar'],
  sslCert: 'test-cert',
  sslKey: 'test-key',
  connectionString: 'test-url',
  maxWaitTime: 100,
  maxBytes: (1024 * 1024),
  idleTimeout: 1000,
};

const config = {
  development: devConfig,
  integration: herokuConfig,
  production: herokuConfig,
  staging: herokuConfig,
};

module.exports = () => config[process.env.NODE_ENV] ?
  config[process.env.NODE_ENV] : config.development;
