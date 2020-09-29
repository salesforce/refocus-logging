const { persist } = require('../../../src/aggregator/persist');
const { initDb, db, aggregateTableName } = require('../../../src/aggregator/db');

describe('test/unit/aggregator/persist.js', () => {
  beforeAll(async (done) => {
    await initDb();
    done();
  });

  it('persist OK', async () => {
    const updatedAt  = new Date().toISOString();
    const key = {
      updatedAt,
      sampleName: 'testSample',
    };

    const jobStartTime = Date.now();
    const result = {
      jobStartTime,
      queueTime: 2,
      publishLatency: 4,
      avgSubscribeLatency: 6,
      numSubsMissed: 0,
      avgEndToEndLatency: 16,
      medianEndToEndLatency: 16,
      ninetyFifthPercentileEndToEndLatency: 18,
      isPublished: true,
      isSuccessfullyEmitted: true,
      numClientsAcknowledged: 2,
      numClientsEmittedTo: 4,
    };
    await persist(key, result);

    dbUpdatedAt = Date.parse(updatedAt);
    const res = await db.query(`select * from ${aggregateTableName} where 
      updated_at = ${dbUpdatedAt}`);

    const expectedRes = {
      avg_end_to_end_latency: 16,
      avg_subscribe_latency: 6,
      is_published: true,
      is_successfully_emitted: true,
      job_start_time: '' + jobStartTime,
      median_end_to_end_latency: 16,
      ninety_fifth_percentile_end_to_end_latency: 18,
      num_clients_acknowledged: 2,
      num_subs_missed: 0,
      publish_latency: 4,
      queue_time: 2,
      sample_name: 'testSample',
      updated_at: '' + dbUpdatedAt,
      num_clients_emitted_to: 4,
    };
    expect(res[0][0]).toEqual(expectedRes);
  });
});
