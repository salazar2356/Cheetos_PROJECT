const express = require("express");

const expressApp = express();
const PORT = 5050;

const httpServer = expressApp.listen(PORT);
const { Server } = require("socket.io");
const ioServer = new Server(httpServer);

const staticController = express.static('public-controller');
const staticDisplay = express.static('public-display');

expressApp.use('/controller', staticController);
expressApp.use('/display', staticDisplay);

// Import de SerialPort package
const {
  SerialPort,
  ReadlineParser
} = require('serialport');

SerialPort.list().then((ports) => {
  console.log('Available ports:');
  ports.forEach((port) => {
    console.log(port.path);
  });
});

// Set the rules for the serial communication

// Opens a port
const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600
});

port.on('error', (err) => {
  console.error('Error en el puerto serial:', err.message);
});


//--------------------------------------- 1- Read without parsing

// Read data from Serial Buffer

// port.on('data', (data) => {
//   console.log("-----", data);
// })

//--------------------------------------- 2- 4- Reading after parsing

const parser = port.pipe(new ReadlineParser);

parser.on('data', (data) => {
  console.log(data);
})

//--------------------------------------- 3- From String to Integer