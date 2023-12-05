// Función para renderizar la tabla desde Firebase
async function renderTableFromFirebase() {
  const tableBody = document.getElementById("bodytableId");

  try {
    // Hacer la solicitud a Firebase para obtener datos de usuarios
    const response = await fetch('https://database-cheetos-default-rtdb.firebaseio.com/user.json');
    const userData = await response.json();

    // Verificar si hay datos de usuarios
    if (userData) {
      // Convertir el objeto de usuarios a un array de pares [ID, datos]
      const userArray = Object.entries(userData);

      // Ordenar el array por puntaje (puedes ajustar esto según tu estructura)
      userArray.sort((a, b) => b[1].score - a[1].score);

      // Limpiar la tabla antes de agregar filas
      tableBody.innerHTML = "";

      // Iterar sobre el array y agregar filas a la tabla
      userArray.slice(0, 5).forEach(([userID, data], index) => {
        const newRow = document.createElement("tr");
        newRow.classList.add("headers");

        const positionCell = document.createElement("td");
        positionCell.classList.add("positionCol");
        positionCell.textContent = (index + 1).toString();

        const usernameCell = document.createElement("td");
        usernameCell.classList.add("usernameCol");
        usernameCell.textContent = data.username; // Aquí se obtiene el nombre de usuario directamente

        const scoreCell = document.createElement("td");
        scoreCell.classList.add("scoreCol");
        scoreCell.textContent = data.score;

        newRow.appendChild(positionCell);
        newRow.appendChild(usernameCell);
        newRow.appendChild(scoreCell);

        tableBody.appendChild(newRow);
      });
    } else {
      console.log("No hay datos de usuarios en Firebase.");
    }
  } catch (error) {
    console.error("Error al obtener datos de Firebase:", error);
  }
}

// Llama a la función para renderizar la tabla desde Firebase al cargar la página
renderTableFromFirebase();


//Escucha el mensaje del server
const laurl = `http://${window.location.hostname}:5050`;

let socket = io(laurl, {
  path: "/real-time",
}); console.log('mira');

// Función para añadir una nueva fila a la tabla desde el socket
function addRowToTable(dataUserScore) {
  const tableBody = document.getElementById("bodytableId");

  // Verificar si el usuario ya está presente en la tabla
  const existingRow = Array.from(tableBody.children).find(row => {
    const usernameCell = row.querySelector(".usernameCol");
    return usernameCell && usernameCell.textContent === dataUserScore[0];
  });

  // Si el usuario ya está presente, actualiza su puntaje
  if (existingRow) {
    const scoreCell = existingRow.querySelector(".scoreCol");
    if (scoreCell) {
      scoreCell.textContent = dataUserScore[1];
    }
  } else {
    // Si el usuario no está presente, crea una nueva fila y agrégala a la tabla
    const newRow = document.createElement("tr");
    newRow.classList.add("headers");

    const positionCell = document.createElement("td");
    positionCell.classList.add("positionCol");

    const usernameCell = document.createElement("td");
    usernameCell.classList.add("usernameCol");
    usernameCell.textContent = dataUserScore[0];

    const scoreCell = document.createElement("td");
    scoreCell.classList.add("scoreCol");
    scoreCell.textContent = dataUserScore[1];

    // Agregar las celdas a la nueva fila
    newRow.appendChild(positionCell);
    newRow.appendChild(usernameCell);
    newRow.appendChild(scoreCell);

    // Agregar la nueva fila a la tabla
    tableBody.appendChild(newRow);
  }

  // Obtener todas las filas de la tabla y convertirlas a un array
  const rows = Array.from(tableBody.children);

  // Ordenar las filas basándote en los puntajes (asumiendo que los puntajes son números)
  rows.sort((a, b) => {
    const scoreA = parseInt(a.querySelector(".scoreCol").textContent);
    const scoreB = parseInt(b.querySelector(".scoreCol").textContent);

    return scoreB - scoreA; // Ordenar de mayor a menor
  });

  // Limpiar la tabla antes de agregar las filas ordenadas
  tableBody.innerHTML = "";

  // Agregar solo las primeras 5 filas ordenadas a la tabla y actualizar las posiciones
for (let index = 0; index < Math.min(5, rows.length); index++) {
  const row = rows[index];
  const newRow = row.cloneNode(true); // Clonar la fila existente para evitar problemas con referencias
  newRow.querySelector(".positionCol").textContent = (index + 1).toString();
  tableBody.appendChild(newRow);
}

}


//Listen to event "scoreRanking" from socket
socket.on("scoreRanking", (dataUserScore) => {
  addRowToTable(dataUserScore); // Añade la nueva información del socket a la tabla existente
});

//Listen to the button event with the joystick and change screen "HOME" To "DISPLAY"
socket.on('joystick', message => {
  const { button } = message;
  console.log("recibido: ", message);

  if (button === 0) {
    // Direction to DISPLAY SCREEN
    window.location.href = 'http://localhost:5050/display/';
  }
});

//Listen to event "registro" from phone
socket.on("data-user", (register) => {
  console.log({
    "username:": register.username,
    "email:": register.email,
    "puntaje": puntaje
  });
});

