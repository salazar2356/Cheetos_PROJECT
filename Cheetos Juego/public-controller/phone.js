const NGROK = `${window.location.hostname}`

let socket = io("http://localhost:5050", { path: './real-time' })

let IsShooting = false;

const button = document.getElementById('btnPressed')

button.addEventListener('click', (e) => {
  console.log("New User")
  socket.emit('confirmation', "aqui toy")
  console.log("ha sido enviado exitosamente")
})
