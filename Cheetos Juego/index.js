// 1. Import dependencies ====================================================

import { express, Server, cors, SerialPort, ReadlineParser, dotenv, bodyParser } from './dependences.js'

// ISA CAMBIOS SOCKET TUTO
// 2. Set the server's configuration with EXPRESS===============================

const PORT = 5050;
const expressApp = express();
expressApp.use(cors({ origin: "*" }));
expressApp.use(bodyParser.json());  // Utiliza bodyParser para analizar el cuerpo JSON
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

// 4. Create server in real time

const io = new Server(server, {
  path: "/real-time",
})

// 5. Connect server to listen and send events

io.on("connection", (socket) => {
  console.log("Connected!", socket.id);

  // 6. The server listens to the event "registro" and broadcasts the message to the event "data-user"
  socket.on("registro", (message) => {
    // Aquí puedes guardar los datos en Firebase o realizar la acción necesaria
    // Utiliza message.username, message.email, y message.score para guardar la información
    console.log(`Nuevo registro - Puntaje: ${message.score}`);

    // Luego, puedes broadcastear el mensaje a los clientes
    socket.broadcast.emit("data-user", message);
  });

  socket.on("dataScoreRanking", (data) => {
    socket.broadcast.emit("scoreRanking", data)
  })
});

// 7. Set the rules for serial communication
// Opens a port

const port = new SerialPort({
  path: 'COM10',
  baudRate: 9600
});

// 8. console.log("puerto: ", port);
port.on('error', (err) => {
  console.error('Error en el puerto serial:', err.message);
});

//======================================================================================================
// Pasar Parsing, de strings a numeros
// Se separan las posiciones de los valores de los strings para poder leerlos y manipularlos
// Método (SPLIT): 
// Se usa para dividir una cadena delimitada en subcadenas

const parser = port.pipe(new ReadlineParser());

parser.on('data', (data) => {
  const formatedData = data.split(',')

  let neededData = {
    x: parseInt(formatedData[0]),
    y: parseInt(formatedData[1]),
    button: parseInt(formatedData[2])
  }

  // console.log(neededData);

  io.emit('joystick', neededData)
});

// 9. Ruta para guardar el puntaje
expressApp.post('/save-score', (req, res) => {
  const { username, email, score } = req.body;

  console.log(`Nuevo puntaje registrado - Usuario: ${username}, Email: ${email}, Puntaje: ${score}`);

  // Envía una respuesta al cliente (el juego)
  res.json({ success: true, message: 'Score saved successfully' });
});
