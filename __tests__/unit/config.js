/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const config = require('../../src/config');
const getConfig = config.getConfig;
const { getMaxWaitTime, getMaxBytes, getIdleTimeout, herokuConfig, devConfig } = config.testExport;

describe('test/unit/config.js helpers', () => {
  it('Returns default values for null, undefined, 0, negative and string values', () => {
    expect(getMaxWaitTime(null)).toBe(100);
    expect(getMaxWaitTime(undefined)).toBe(100);
    expect(getMaxWaitTime(0)).toBe(100);
    expect(getMaxWaitTime(-1)).toBe(100);
    expect(getMaxWaitTime('foo')).toBe(100);

    expect(getMaxBytes(null)).toBe(1048576);
    expect(getMaxBytes(undefined)).toBe(1048576);
    expect(getMaxBytes(0)).toBe(1048576);
    expect(getMaxBytes(-1)).toBe(1048576);
    expect(getMaxBytes('foo')).toBe(1048576);

    expect(getIdleTimeout(null)).toBe(1000);
    expect(getIdleTimeout(undefined)).toBe(1000);
    expect(getIdleTimeout(0)).toBe(1000);
    expect(getIdleTimeout(-1)).toBe(1000);
    expect(getIdleTimeout('foo')).toBe(1000);
  });

  it('Returns the value passed for positive number', () => {
    expect(getIdleTimeout('20')).toBe(20);
    expect(getMaxWaitTime('30')).toBe(30);
    expect(getMaxBytes('40')).toBe(40);
  });
});

describe('test/unit/config.js getConfig', () => {
  it('takes environment name if not passed and returns the respective config', () => {
    process.env.NODE_ENV = 'development';
    const resultConfig = getConfig();
    expect(resultConfig).toEqual(devConfig);
  });

  it('Overrides env variables if given and returns the respective config', () => {
    expect(getConfig('development')).toEqual(devConfig);
    expect(getConfig('production')).toEqual(herokuConfig);
    expect(getConfig('integration')).toEqual(herokuConfig);
    expect(getConfig('staging')).toEqual(herokuConfig);
  });
});
