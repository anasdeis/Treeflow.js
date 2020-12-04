const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const numDevices = 100;
const grid_data = {};

let value;
for (let i = 0; i < numDevices; i++) {
    value = random_normal(50,15);
    grid_data[`device${i}`] = {
        x: value,
        y: 3 * value,
        deviceId: `device${i}`
    }
}
console.log('emitting initial grid');
socket.emit('newDataPoints', {id: 0, data: Object.values(grid_data)});

setInterval(() => {
    const updates = [];
    let i;
    for (i = 0; i < Math.random() * 10; i++) {
        //const updatedDevice = Math.floor(Math.random() * numDevices)
        const updatedDevice = Math.floor(Math.random() * numDevices * 2)
        const deviceKey = `device${updatedDevice}`
        //const newX = randomize(grid_data[deviceKey].x)
        //const newY = randomize(grid_data[deviceKey].y)
        // If updateDevice can be > numDevices then do not use randomize
        const newX = random_normal(50,15);
        const newY = 3 * newX;
        const update = {x: newX, y: newY, deviceId: deviceKey}
        updates.push(update);
    }
    console.log('emitting update for', i, 'devices');
    console.log(updates)
    socket.emit('newDataPoints', {id: 0, data: updates});
    console.log('sent');
}, 5000)

/**
 * Return a gaussian random value using mean and standard deviation using the Marsaglia Polar method
 * @param  {number} mean, default = 0
 * @param  {number} dev, standard deviation default = 1
 * @return {number}
 */
function random_normal(mean = 0, dev = 1) {
    let s, u, v;

    do {
        // U and V are from the uniform distribution on (-1, 1)
        u = Math.random() * 2 - 1;
        v = Math.random() * 2 - 1;

        s = u * u + v * v;
    } while (s >= 1);

    // Compute the standard normal variate
    const norm = u * Math.sqrt(-2 * Math.log(s) / s);

    // Shape and scale
    return dev * norm + mean;
}

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