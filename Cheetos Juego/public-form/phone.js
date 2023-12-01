//Get DNS from the URL
const DNS = getDNS;

//Import socket to listen or send messages using events.
const laurl = `http://${window.location.hostname}:5050`;
let socket = io( laurl, {
  path: "/real-time",
});

const button = document.getElementById('btnPressed')

button.addEventListener('click', (e) => {
  const register = {username:"X", email: "x@gmail.com" }

  socket.emit("registro", register)
  
})

//========================

function radioButtonClick() {

    console.log("click");
    const color = {
      r: 1,
      g: 2,
      b: 255,
    };

    //Emit the message to the server with the event "sending-color"
    socket.emit("sending-color", color);
}