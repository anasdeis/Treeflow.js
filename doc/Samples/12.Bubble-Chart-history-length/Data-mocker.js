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
    }
};

console.log('emitting initial dict');
socket.emit('newDataPoints', {id: 0, centroids: Object.values(deviceDict)});

setInterval(() => {
    console.log('emitting update for device device1');
    socket.emit('newDataPoints', {id: 0, centroids: [deviceDict['device1']]});
    console.log('sent');
}, 5000);