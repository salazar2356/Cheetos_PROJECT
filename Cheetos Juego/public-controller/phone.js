const NGROK = `http://${window.location.hostname}:5050`
const DNS = getDNS;
let socket = io()

let IsShooting = false;

function setup() {
  createCanvas(1200, 1200); // Crear un lienzo
  button = createButton('Disparar');
  button.position(120, 200); // Establecer la posición del botón en el lienzo
  button.mousePressed(pressedBtn); // Función para enviar el mensaje al server
  button.style('font-size', '60px')
  button.size(800, 400)
}

function draw() {
  background(220); // Fondo del lienzo
  fill(0); // Color del texto del botón
}

function pressedBtn() {
  IsShooting = true;
  socket.emit('disparo', IsShooting)
  IsShooting = false;
  console.log('valor del boton' + ': ' + IsShooting);
}
