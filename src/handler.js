const handlerUtil = require('./handlerUtil');
module.exports = (topic) => handlerUtil.specialHandlers()[topic] ?
    handlerUtil.specialHandlers()[topic] : handlerUtil.defaultHandler;
