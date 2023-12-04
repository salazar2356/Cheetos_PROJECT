//Escucha el mensaje del server
const laurl = `http://${window.location.hostname}:5051`;

let socket = io(laurl, {
  path: "/real-time",
}); console.log('mira');

const tableBody = document.getElementById("bodytableId")

//=======================================================================================================

let button;
let puntaje = 0;
//Listen to the button event with the joystick and change screen "HOME" To "DISPLAY"

socket.on('joystick', message => {
  const { button } = message;
  console.log("recibido: ", message);

  if (button === 0) {
    // Direction to DISPLAY SCREEN
    window.location.href = 'http://localhost:5051/display/';
  }
})

//Listen to event "registro" from phone
socket.on("data-user", (register) => {
  console.log({
    "username:": register.username,
    "email:": register.email,
    "puntaje": puntaje
  });
})

socket.on("scoreRanking", (dataUserScore) => {
  // Crear nueva fila para la tabla
  const newRow = document.createElement("tr");
  newRow.classList.add("headers")

  // Crear celdas de datos para la nueva fila
  const positionCell = document.createElement("td");
  positionCell.textContent = "1"; // Por el momento, establecemos la posición como 1
  positionCell.classList.add("positionCol")

  const usernameCell = document.createElement("td");
  usernameCell.textContent = dataUserScore[0];
  usernameCell.classList.add("usernameCol")

  const scoreCell = document.createElement("td");
  scoreCell.textContent = dataUserScore[1];
  scoreCell.classList.add("scoreCol")

  // Agregar las celdas a la nueva fila
  newRow.appendChild(positionCell);
  newRow.appendChild(usernameCell);
  newRow.appendChild(scoreCell);

  // Agregar la nueva fila a la tabla
  tableBody.appendChild(newRow);
})
