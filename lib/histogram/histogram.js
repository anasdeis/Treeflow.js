import {statistics} from 'echarts-stat';
import utils from './utils.js';

var dataPreprocess = utils.dataProcess.dataPreprocess;
var normalizeDimensions = utils.dataProcess.normalizeDimensions;
var ascending = utils.array.ascending;
var map = utils.array.map;
var bisect = utils.array.bisect;

/**
 * Compute bins for histogram
 * @see    https://github.com/d3/d3-array/blob/master/src/bin.js
 * @param  {Array.<number>} data
 * @param  {number} optOrMethod Optional settings or `method`.
 * @param  {Object|string} optOrMethod.method 'squareRoot' | 'scott' | 'freedmanDiaconis' | 'sturges'
 * @param  {Array.<number>|number} optOrMethod.dimensions If data is a 2-d array,
 *         which dimension will be used to calculate histogram.
 * @param  {number} numberOfBins positive integer > 0 manually set, overrides method
 * @return {Object}
 */
export function computeBins(data, optOrMethod, numberOfBins) {
    var opt = typeof optOrMethod === 'string'
        ? { method: optOrMethod }
        : (optOrMethod || {});

    var isBins = Number.isInteger(numberOfBins) > 0;

    var threshold = opt.method == null
        ? thresholdMethod.squareRoot
        : thresholdMethod[opt.method];
    var dimensions = normalizeDimensions(opt.dimensions);

    var values = dataPreprocess(data, {
        dimensions: dimensions,
        toOneDimensionArray: true
    });
    var maxValue = statistics.max(values);
    var minValue = statistics.min(values);
    var binsNumber = isBins === true
        ? numberOfBins
        : threshold(values, minValue, maxValue);
    var tickStepResult = utils.tickStep(minValue, maxValue, binsNumber);
    var step = tickStepResult.step;
    var toFixedPrecision = tickStepResult.toFixedPrecision;

    // return the xAxis coordinate for each bins, except the end point of the value
    var rangeArray = utils.range(
        // use function toFixed() to avoid data like '0.700000001'
        +((Math.ceil(minValue / step) * step).toFixed(toFixedPrecision)),
        +((Math.floor(maxValue / step) * step).toFixed(toFixedPrecision)),
        step,
        toFixedPrecision
    );

    var len = rangeArray.length;

    var bins = new Array(len + 1);

    for (var i = 0; i <= len; i++) {
        bins[i] = {};
        bins[i].sample = [];
        bins[i].x0 = i > 0
            ? rangeArray[i - 1]
            : (rangeArray[i] - minValue) === step
            ? minValue
            : (rangeArray[i] - step);
        bins[i].x1 = i < len
            ? rangeArray[i]
            : (maxValue - rangeArray[i-1]) === step
            ? maxValue
            : rangeArray[i - 1] + step;
    }

    for (var i = 0; i < values.length; i++) {
        if (minValue <= values[i] && values[i] <= maxValue) {
            bins[bisect(rangeArray, values[i], 0, len)].sample.push(values[i]);
        }
    }

    var data = map(bins, function (bin) {
        // use function toFixed() to avoid data like '6.5666638489'
        return [
            +((bin.x0 + bin.x1) / 2).toFixed(toFixedPrecision),
            bin.sample.length,
            bin.x0,
            bin.x1,
            bin.x0 + ' - ' + bin.x1
        ];
    });

    var customData = map(bins, function (bin) {
        return [bin.x0, bin.x1, bin.sample.length];
    });

    return {
        bins: bins,
        data: data,
        customData: customData
    };
}

/**
 * Generate data in ECharts heatmap format for 2D histograms: [bin_x,bin_y,count]
 * @param  {Array.<number>} dataX
 * @param  {Array.<number>} dataY, same length as dataX
 * @param  {number} optOrMethod Optional settings or `method`.
 * @param  {Object|string} optOrMethod.method 'squareRoot' | 'scott' | 'freedmanDiaconis' | 'sturges'
 * @param  {Array.<number>|number} optOrMethod.dimensions If data is a 2-d array,
 *         which dimension will be used to calculate histogram.
 * @param  {number} numberOfBinsX positive integer > 0 manually set, overrides method
 * @param  {number} numberOfBinsY positive integer > 0 manually set, overrides method
 * @return {Object}
 */
export function computeBins2dHeatmap(dataX, dataY, optOrMethod, numberOfBinsX, numberOfBinsY ) {

    if(dataX.length != dataY.length || dataX.length == 0){
        console.log('computeBins2dHeatmap: dataX.length must be equal to dataY.length and > 0 to compute!');
        return {
            data: [],
            x_axis: [],
            y_axis: []
        };
    }

    var data_x = computeBins(dataX,optOrMethod,numberOfBinsX);
    var data_y = computeBins(dataY,optOrMethod,numberOfBinsY);

    var x_axis = data_x.data;
    x_axis = x_axis.map(function (item) {
        return item[4];
    });

    var y_axis = data_y.data;
    y_axis = y_axis.map(function (item) {
        return item[4];
    });

    var data = [];
    var index = 0;
    var stepY = data_y.bins[0].x1 - data_y.bins[0].x0;
    for (var i = 0; i < data_x.bins.length; i++) {
        var sample = data_x.bins[i].sample;
        var y_bins = {}
        for (var j = 0; j < sample.length; j++, index++){
            var x = sample[j];
            var y = dataY[index];

            var y_bin = Math.floor((y - data_y.bins[0].x0)/stepY);
            y_bins[y_bin] = (y_bins[y_bin]+1) || 1;
        }
        for (const [y_bin, count] of Object.entries(y_bins)) {
            data.push([i, parseInt(y_bin), count])
        }
    }

    return {
        data: data,
        x_axis: x_axis,
        y_axis: y_axis
    };
}

/**
 * Four kinds of threshold methods used to
 * compute how much bins the histogram should be divided
 * @see  https://en.wikipedia.org/wiki/Histogram
 * @type {Object}
 */

var thresholdMethod = {

    squareRoot: function (data) {

        var bins = Math.ceil(Math.sqrt(data.length));

        return bins > 50 ? 50 : bins;
    },

    scott: function (data, min, max) {

        return Math.ceil((max - min) / (3.5 * statistics.deviation(data) * Math.pow(data.length, -1 / 3)));
    },

    freedmanDiaconis: function (data, min, max) {

        data.sort(ascending);

        return Math.ceil(
            (max - min) / (2 * (statistics.quantile(data, 0.75) - statistics.quantile(data, 0.25)) * Math.pow(data.length, -1 / 3))
        );
    },

    sturges: function (data) {

        return Math.ceil(Math.log(data.length) / Math.LN2) + 1;

    }
}