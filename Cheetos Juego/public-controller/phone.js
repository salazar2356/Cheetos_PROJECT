const NGROK = `${window.location.hostname}`

let socket = io("http://localhost:5050", {path:'./real-time'})

//let IsShooting = false;

//const button = document.getElementById('boton-disparo')

//button.addEventListener('click', (e) => {
  //console.log('funciona');
  //socket.emit('prueba', 'funciona')
//})

function setup() {
  frameRate(60)
  createCanvas(windowWidth, windowHeight)
}

const x = 500
const y = 500
const size = 50

function draw() {
  ellipse(x, y, size, size)
  probarMandarDatos()
  
}

//==========================================
//INTENTO SOCKET

function probarMandarDatos() {
  if (dist(pmouseX, pmouseY, x, y) < size) {
      console.log("New User")
      socket.emit('confirmation', "aqui toy")
      console.log("ha sido enviado exitosamente")
  }
}
