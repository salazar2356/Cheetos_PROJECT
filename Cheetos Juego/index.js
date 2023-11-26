import { express, Server, cors, SerialPort, ReadlineParser, dotenv } from './dependences.js'
const expressApp = express();
const PORT = 5050;
const httpServer = expressApp.listen(PORT);

const ioServer = new Server(httpServer, { path: '/real-time' });

const staticController = express.static('public-controller');
const staticDisplay = express.static('public-display');
const staticHome = express.static('public-home');

expressApp.use(express.json());
expressApp.use(cors({ origin: "*" }));
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use('/', staticHome)
expressApp.use('/form', staticController);
expressApp.use('/game', staticDisplay);
dotenv.config();

// Import de SerialPort package
SerialPort.list().then((ports) => {
  console.log('Available ports:');
  ports.forEach((port) => {
    console.log(port.path);
  });
});

// Set the rules for the serial communication

// Opens a port
const port = new SerialPort({
  path: 'COM10',
  baudRate: 9600
});

port.on('error', (err) => {
  console.error('Error en el puerto serial:', err.message);
});

//--------------------------------------- 2- 
//Pasar Parsing, de strings a numeros
//Se se paran las posiciónes de los valores de los strings para poder leerlos y manipularlos
//Metodo (SPLIT): 
//Se usa para dividir una cadena delimitada en subcadenas

const parser = port.pipe(new ReadlineParser);

parser.on('data', (data) => {
  const formatedData = data.split(' ')
  const neededData = {
    x: parseInt(formatedData[1]),
    y: parseInt(formatedData[3]),
    button: parseInt(formatedData[5])
  }
  // console.log(neededData);
  ioServer.emit('joystick', neededData)
})

//================================ 3- Connecion
//INTENTO SOCKET
ioServer.on('connection', (socket) => {
  //Configurar un manejador de eventos para al evento "confimation"
  socket.on('confirmation', (data) => {
    socket.broadcast.emit('confirmation', data)
  })

})


export { ioServer }