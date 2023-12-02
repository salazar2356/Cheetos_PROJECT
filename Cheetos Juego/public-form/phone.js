//Get DNS from the URL
const DNS = getDNS;

//Import socket to listen or send messages using events.
const laurl = `http://${window.location.hostname}:5050`;
let socket = io( laurl, {path: "/real-time"});

//========================
//Obtiene elementos "inputs"

const btnSend = document.getElementById('submit')
const inputUsername = document.getElementById("username")
const inputEmail = document.getElementById("email")
//Función para pintar en consola los datos del User a través de Socket 

btnSend.addEventListener('click', (e) => {
  const register = { username: inputUsername.value, email: inputEmail.value }
  console.log("Usuario registrado correctamente");

  socket.emit("registro", register)
})

