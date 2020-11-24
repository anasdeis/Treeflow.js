const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const numDevices = 100;
const grid_data = {};
grid_data.id = 0;

setInterval(() => {

    grid_data.x = random_normal(50,15);
    grid_data.y = 3 * grid_data.x;

    console.log('pushed data.x:', grid_data.x,', data.y:', grid_data.y);
    socket.emit('newDataPoint', grid_data);
}, 500)

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