/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

// This needs to stay in different file since we wanted to mock
// specialHandlers and defaultHandler but not the method that is being
// exported right now

const handlerUtil = require('./handlerUtil');
module.exports = (topic) => handlerUtil.specialHandlers()[topic] ?
    handlerUtil.specialHandlers()[topic] : handlerUtil.defaultHandler;
