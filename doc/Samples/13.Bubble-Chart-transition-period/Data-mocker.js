const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const deviceDict = {
    'device1': {
        x: 10,
        y: 10,
        deviceId: `device1`
    },
    'device2': {
        x: 90,
        y: 90,
        deviceId: `device2`
    },
    'device3': {
        x: 91,
        y: 91,
        deviceId: `device3`
    }
};

console.log('emitting initial dict');
socket.emit('newDataPoints', {id: 0, data: Object.values(deviceDict)});

setInterval(() => {
    deviceDict['device3'] = {x: 10, y: 10, deviceId: 'device3'}
    console.log('changing device3 to be clustered with device1');
    socket.emit('newDataPoints', {id: 0, centroids: Object.values(deviceDict)});
    console.log('sent');
}, 5000);
