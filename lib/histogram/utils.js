define(function (require) {

    var utils = {};

    utils.array = require('./utils/array');
    utils.dataProcess = require('./utils/dataProcess');
    utils.number = require('./utils/number');
    utils.object = require('./utils/object');
    utils.range = require('./utils/range');
    utils.tickStep = require('./utils/tickStep');

    module.exports = utils;

});