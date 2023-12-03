// Get DNS from the URL
const DNS = getDNS;

// Import socket to listen or send messages using events.
const laurl = `http://${window.location.hostname}:5050`;
let socket = io(laurl, { path: "/real-time" });

// ========================
// Obtiene elementos "inputs"

document.getElementById("submit").addEventListener('click', function(e){
    e.preventDefault();
    
    // Obtiene el puntaje almacenado en localStorage
    const puntaje = localStorage.getItem('puntaje');
    
    // Verifica si hay un puntaje almacenado antes de enviarlo a Firebase
    if (puntaje) {
        // Agrega el puntaje al objeto de registro
        const register = { 
            username: document.getElementById("username").value, 
            email: document.getElementById("email").value, 
            score: puntaje 
        };

        console.log('Enviando registro al servidor:', register);

        // Emitir el evento "registro" con los datos del usuario y el puntaje
        socket.emit("registro", register);
    }
});

