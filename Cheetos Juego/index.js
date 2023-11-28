import { express, Server, cors, SerialPort, ReadlineParser, dotenv } from './dependences.js'
const expressApp = express();
const PORT = 5050;
const httpServer = expressApp.listen(PORT, ()=>{console.log("listening at ", PORT)});

const ioServer = new Server(httpServer);
//console.log(ioServer); , { path: '/real-time' }
const staticController = express.static('public-controller');
const staticDisplay = express.static('public-display');
const staticHome = express.static('public-home');

expressApp.use(express.json());
expressApp.use(cors({ origin: "*" }));
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use('/', staticHome)
expressApp.use('/controller', staticController);
expressApp.use('/display', staticDisplay);
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

//console.log("puerto: ", port);
port.on('error', (err) => {
  console.error('Error en el puerto serial:', err.message);
});

//--------------------------------------- 2- 
//Pasar Parsing, de strings a numeros
//Se se paran las posiciónes de los valores de los strings para poder leerlos y manipularlos
//Metodo (SPLIT): 
//Se usa para dividir una cadena delimitada en subcadenas

const parser = port.pipe(new ReadlineParser());

parser.on('data', (data) => {
  
  const formatedData = data.split(',')

  let neededData = {
      x: parseInt(formatedData[0]),
      y: parseInt(formatedData[1]),
     button: parseInt(formatedData[2])
  }
  
  //console.log(neededData);
 
  // console.log(neededData);
  ioServer.emit('joystick', neededData)
})

//================================ 3- Connecion
//INTENTO SOCKET

  //Configurar un manejador de eventos para al evento "confimation"

  ioServer.on('connection', (socket) => {
    //Configurar un manejador de eventos para al evento "confimation"
    socket.on('confirmation', (data) => {
        socket.broadcast.emit('confirmation', data)
    })
})


//ioServer.on('connection', (socket) => {
  //Configurar un manejador de eventos para al evento "confimation"
  /*console.log("CONNECTED !!!", socket);
  socket.on('disconnect', (data) => {
    //socket.broadcast.emit('confirmation', data)
  //  console.log("close ");
  socket.on("confirmation", (sockettt) =>{
    console.log("Server");

  })

  })
})

ioServer.emit('mensajex', console.log("x"))


//export { ioServer }*/