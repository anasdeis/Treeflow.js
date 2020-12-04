const io = require('socket.io-client');
const socket = io('http://localhost:3000');

// rawData from echarts bubble chart example https://echarts.apache.org/examples/en/editor.html?c=bubble-gradient
const rawData = [[28604,77,17096869,'Australia',1990],[31163,77.4,27662440,'Canada',1990],[1516,68,1154605773,'China',1990],[13670,74.7,10582082,'Cuba',1990],[28599,75,4986705,'Finland',1990],[29476,77.1,56943299,'France',1990],[31476,75.4,78958237,'Germany',1990],[28666,78.1,254830,'Iceland',1990],[1777,57.7,870601776,'India',1990],[29550,79.1,122249285,'Japan',1990],[2076,67.9,20194354,'North Korea',1990],[12087,72,42972254,'South Korea',1990],[24021,75.4,3397534,'New Zealand',1990],[43296,76.8,4240375,'Norway',1990],[10088,70.8,38195258,'Poland',1990],[19349,69.6,147568552,'Russia',1990],[10670,67.3,53994605,'Turkey',1990],[26424,75.7,57110117,'United Kingdom',1990],[37062,75.4,252847810,'United States',1990]];
let lastEmitted = rawData;
setInterval(() => {
    const randomized = lastEmitted.map(datum => {
        return datum.map((e, index) => {
            if (index !== 3) {
                return randomize(e);
            }
            else {
                return e;
            }
        });
    });
    lastEmitted = randomized;
    const mapped = randomized.map(datum => {
        return {x: datum[0], y: datum[1], size: Math.sqrt(datum[2]) / 5e2, label: datum[3]}
    });
    console.log('emitting');
    socket.emit('newDataPoints', {id: 0, data: mapped});
    console.log('sent');
}, 5000)

/**
 * Return a random value in range x +/- 10%
 * @param {*} x 
 */
function randomize(x) {
    const variance = 0.20;
    const multiplier = Math.random() - 0.5;
    const newValue = x + (x * variance * multiplier);
    return newValue;
}