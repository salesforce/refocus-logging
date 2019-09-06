const Sequelize = require('sequelize');
const { dbUrl, aggregateTableName } = require('../config').getConfig();
const pgtools = require('pgtools');
const url = require('url');
const logger = require('pino')();

const db = new Sequelize(dbUrl, {
  logging: false,
});

/**
 * Create a dbconfig object from the DB URL.
 *
 * @param {String} dbUrl - The DB URL. Leave empty to use the one from env.
 * @returns {Object} - dbconfig
 */
const dbConfigObjectFromDbURL = (dbUrl) => {
  const u = url.parse(dbUrl);
  const auth = u.auth.split(':');
  return {
    name: u.pathname.slice(1), // strip off leading slash
    user: auth[0],
    password: auth[1],
    host: u.hostname,
    port: u.port,
  };
};

let alreadyInitialized = false;

/**
 * Create a dbconfig object from the DB URL.
 * @returns {Promise} - Promise resolved when the function finishes execution
 */
const initDb = async () => {
  const dbConfig = dbConfigObjectFromDbURL(dbUrl);
  try {
    await pgtools.createdb(dbConfig, dbConfig.name);
  } catch (e) {
    logger.error(`Error in init db: ${e}`);
    return;
  }

  const createTable = `CREATE TABLE ${aggregateTableName}
  (
      updated_at bigint,
      sample_name text,
      job_start_time bigint,
      queue_time smallint,
      publish_latency int,
      avg_subscribe_latency real,
      num_subs_missed smallint,
      avg_end_to_end_latency real,
      median_end_to_end_latency real,
      ninety_fifth_percentile_end_to_end_latency real,
      is_published bool,
      is_successfully_emitted bool,
      num_clients_emitted_to smallint,
      num_clients_acknowledged smallint
  );`;

  await db.query(createTable);

  await db.query(`CREATE UNIQUE INDEX range_query_index
  on ${aggregateTableName} (updated_at, sample_name);`);
  
};

module.exports = {
  db,
  initDb,
  aggregateTableName,
};
