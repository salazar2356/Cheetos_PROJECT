//Escucha el mensaje del server
const laurl = `http://${window.location.hostname}:5050`;

let socket = io( laurl, {
    path: "/real-time",
  });console.log('mira');

//=======================================================================================================

let button;
//Listen to the button event with the joystick and change screen "HOME" To "DISPLAY"

socket.on('joystick', message => {
  const { button } = message;
  console.log("recibido: ", message);

  if (button === 0) {
// Direction to DISPLAY SCREEN
    window.location.href = 'http://localhost:5050/display/'; 
    
  }
})