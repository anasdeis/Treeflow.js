const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const numDevices = 100
const deviceDict = {};
for (let i = 0; i < numDevices; i++) {
    deviceDict[`device${i}`] = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        deviceId: `device${i}`
    }
}
console.log('emitting initial dict');
socket.emit('newDataPoints', {id: 0, centroids: Object.values(deviceDict)});

setInterval(() => {
    const updates = [];
    let i;
    for (i = 0; i < Math.random() * 10; i++) {
        const updatedDevice = Math.floor(Math.random() * numDevices)
        const deviceKey = `device${updatedDevice}`
        const newX = clamp(randomize(deviceDict[deviceKey].x), 0, 100)
        const newY = clamp(randomize(deviceDict[deviceKey].y), 0, 100)
        const update = {x: newX, y: newY, deviceId: deviceKey}
        updates.push(update);
        deviceDict[deviceKey] = update;
    }
    console.log('emitting update for', i, 'devices');
    socket.emit('newDataPoints', {id: 0, centroids: updates});
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

function clamp(x, min, max) {
    return x < min ? min : (x > max ? max : x);
}