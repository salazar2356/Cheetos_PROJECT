//Escucha el mensaje del server
const NGROK = `${window.location.hostname}`

let socket = io("http://localhost:5050", { path: './real-time' })
console.log('mira');