// 1. Import dependencies ====================================================

import { express, Server, cors, SerialPort, ReadlineParser, dotenv } from './dependences.js'

//ISA CAMBIOS SOCKET TUTO
// 2. Set the server's configuration with EXPRESS===============================

const PORT = 5050;
const expressApp = express();
expressApp.use(cors({origin:"*"}));
expressApp.use(express.json());
expressApp.use("/display", express.static("public-display"));
expressApp.use("/form", express.static("public-form"));
expressApp.use("/home", express.static("public-home"));

// 3. Create the server using EXPRESS ===============================

const server = expressApp.listen(PORT, () => {
  console.table({
    Display: `http://localhost:${PORT}/display`,
    Form: `http://localhost:${PORT}/form`,
    Home: `http://localhost:${PORT}/home`,
  })
})

//4. Create server in real time

const io = new Server(server, {
  path:"/real-time",
})

//5. Connect server to listen and send events

io.on("connection", (socket) => {
  console.log("Connected!", socket.id);

//6.the server listens to the event "sending-color" and broadcasts the message to the event "receiving-color"

  socket.on("sending-color", (message) => {
    socket.broadcast.emit("receiving-color", message);
  });
});

//====================================================


//7.Set the rules for the serial communication
// Opens a port

const port = new SerialPort({
  path: 'COM10',
  baudRate: 9600
});

//8. console.log("puerto: ", port);
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
 
  io.emit('joystick', neededData)
})


