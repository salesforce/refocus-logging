
const getMaxWaitTime = () => {
  const maxWait = +process.env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS;
  if (maxWait === 0 || maxWait === NaN) {
    return 100;
  }

  return maxWait;
};

const getMaxBytes = () => {
  const maxBytes = +process.env.KAFKA_CONSUMER_MAX_BYTES;
  if (maxBytes === 0 || maxBytes === NaN) {
    return 1024 * 1024;
  }

  return maxBytes;
};

const getIdleTimeout = () => {
  const idleTimeout = +process.env.KAFKA_CONSUMER_IDLE_TIMEOUT;
  if (idleTimeout === 0 || idleTimeout === NaN) {
    return 1000;
  }

  return idleTimeout;
};

const herokuConfig = {
  topics: process.env.TOPICS ? process.env.TOPICS.split(',').map((string) => string.trim()) : [''],
  sslCert: process.env.KAFKA_CLIENT_CERT || '.ssl/client.crt',
  sslKey: process.env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  connectionString: process.env.KAFKA_URL ? process.env.KAFKA_URL.replace(/\+ssl/g, '') : '',
  maxWaitTime: getMaxWaitTime(),
  maxBytes: getMaxBytes(),
  idleTimeout: getIdleTimeout(),
};

const integrationConfig = {
  topics: ['integration'],
  sslCert: process.env.KAFKA_CLIENT_CERT || '.ssl/client.crt',
  sslKey: process.env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  connectionString: process.env.KAFKA_URL ? process.env.KAFKA_URL.replace(/\+ssl/g, '') : '',
  maxWaitTime: getMaxWaitTime(),
  maxBytes: getMaxBytes(),
  idleTimeout: getIdleTimeout(),
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
  integration: integrationConfig,
  production: herokuConfig,
  staging: herokuConfig,
};

module.exports = (environmentName) => {
  if (!environmentName) environmentName = process.env.NODE_ENV;
  return config[environmentName] ? config[env] : config.development;
};
