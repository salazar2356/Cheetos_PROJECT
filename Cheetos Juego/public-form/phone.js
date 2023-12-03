// Get DNS from the URL
const DNS = getDNS;

// Import socket to listen or send messages using events.
const laurl = `http://${window.location.hostname}:5050`;
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
        // Agrega el puntaje al objeto de registro
        const register = {
            username: usernameValue,
            email: emailValue,
            score: puntaje
        };

        console.log('Enviando registro al servidor:', register);

        // Emitir el evento "registro" con los datos del usuario y el puntaje
        socket.emit("registro", register);
    }
});

const scoreFill = document.getElementById('scoreContent')
// pintar de forma dinamica el puntaje
socket.on("score-user", (score) => {
    scoreFill.textContent = score
    console.log("llega");
})
