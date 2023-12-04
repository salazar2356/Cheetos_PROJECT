// Get DNS from the URL
const DNS = getDNS;

// Import socket to listen or send messages using events.
const laurl = `${window.location.hostname}`;
let socket = io(laurl, { path: "/real-time" });

// ========================
// Obtiene elementos "inputs"
document.getElementById("llama_Menu3").addEventListener('click', function (e) {

    e.preventDefault();

    // Obtiene el puntaje almacenado en localStorage
    const puntaje = localStorage.getItem('puntaje');
    const usernameValue = document.getElementById("username").value;
    const emailValue = document.getElementById("email").value;
    // Verifica si hay un puntaje almacenado antes de enviarlo a Firebase
    if (puntaje) {
      //  window.location.href = 'https://6b48-181-68-150-159.ngrok-free.app/home';

        // Agrega el puntaje al objeto de registro
        const register = {
            username: usernameValue,
            email: emailValue,
            score: puntaje
        };

        console.log('Enviando registro al servidor:', register);

        // Emitir el evento "registro" con los datos del usuario y el puntaje
        socket.emit("registro", register);
        socket.emit("screen-change")

    }
});
