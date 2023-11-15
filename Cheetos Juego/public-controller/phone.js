// pantalla1.js
let socket = io(); // Declarar e inicializar socket

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-shoot");
  btn.addEventListener("click", () => {
    socket.emit("disparo"); // Emitir un evento llamado "disparo" cuando se presiona el botón
  });

  socket.on("nom", () => {
    console.log("Ya");
  });
});
