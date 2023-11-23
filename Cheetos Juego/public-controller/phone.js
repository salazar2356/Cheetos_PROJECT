const NGROK = `https://${window.location.hostname}`
const DNS = getDNS;
let socket = io(NGROK, {
  path: '/real-time'
})

const btnShoot = document.getElementById('btn-shoot')

let IsShooting = false;

btnShoot.addEventListener('click', () => {
  IsShooting = true;
  socket.emit('disparo', IsShooting)
  IsShooting = false;
  console.log("disparb");
})


// document.addEventListener("DOMContentLoaded", () => {
//   const btn = document.getElementById("btn-shoot");
//   btn.addEventListener("click", () => {
//     socket.emit("disparo"); // Emitir un evento llamado "disparo" cuando se presiona el botón
//   });

//   socket.on("nom", () => {
//     console.log("¡Ya!");
//   });
// });
