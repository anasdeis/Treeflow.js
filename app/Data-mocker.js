const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const  randomCountry = require('random-country');

let x = 0;
const interval = setInterval(() => {
    const data = {};
    data.gdp = Math.floor((Math.random() * 35000) + 15000);
    data.age = Math.floor((Math.random() * 30) + 55);
    data.number = Math.floor((Math.random() * 995000000) + 5000000);
    data.country = randomCountry({ full: true });
    data.year = '2015';
    data.id = 0;
    x++;
    console.log("pushed data.gdp: " + data.gdp + " data.age: " + data.age + " + data.number: + " +  data.number + " + data.country: " + data.country + " data.year: " + data.year);
    socket.emit('newDataPoint', data);
    if (x > 20 )  clearInterval(interval);
}, 500);