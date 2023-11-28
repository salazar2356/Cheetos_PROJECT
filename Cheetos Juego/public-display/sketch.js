//Escucha el mensaje del server
const NGROK = `${window.location.hostname}`

let socket = io();//"http://localhost:5050", { path: './real-time' }

/*socket.on('connection', client => { 
  console.log("recibido: ", client);
});*/

let x, y; // Coordenadas de la imagen
let tiempoInicio;
let velocidadX = 10; // Velocidad inicial en el eje X en píxeles por milisegundo
let tamanoImagen = 300; // Tamaño de la imagen en píxeles (ancho y alto)
let direccion = 1; // Dirección del movimiento (1 para derecha, -1 para izquierda)
let lastSpeedIncrease = 0; // Registro del tiempo de la última aceleración
let nuevaImg; // Variable para la nueva imagen
let mostrarNuevaImagen = false; // Variable para controlar si se debe mostrar la nueva imagen
let tiempoInicioNuevaImg; // Variable para el tiempo de inicio de la nueva imagen
let imgCheto; //Variable del boliqueso


// Sonidos
let sonidoColision;
let endsound;
let failshoot;
let musicaFondo;

// PHONE
let bolita;
let mira;
let miraDirection = 1;
let velocidadDisparo = 29;
//JOYSTICK
let miradisparo;
let posx;
let posy;
let velocidad = 10;

let puntaje = 0; // Variable para el puntaje
let customFont; // Variable para la fuente personalizada

let mostrarBien = false; // Variable para controlar el aviso "Bien!"
let bienTimer = 30; // Duración del aviso en cuadros (medio segundo)

let mostrarFallo = false; // Variable para controlar el aviso "Intenta de nuevo!"
let FalloTimer = 30; // Duración del aviso en cuadros (medio segundo)

let tiempoTranscurrido = 0;
let juegoDetenido = false; // Variable para controlar si el juego se detuvo
let tiempoJuego = 50 * 1000; // Duración total del juego en milisegundos (en este caso, 50 segundos) Esto se puede cambiar abajo
let tiempoRestante = tiempoJuego - tiempoTranscurrido;

let anchoMira; // Agregado para almacenar el ancho de la mira
let altoMira; // Agregado para almacenar el alto de la mira


function preload() {
  // Carga las imagenes antes de ejecutar el sketch
  miradisparo = loadImage('mira.png');
  fondoMupi = loadImage('fondoMupi.jpg')

  nuevaImg = loadImage('chesterAcierto.png');
  img = loadImage('chesterb.png');
  imgCheto = loadImage('Cheese_ball.png');

  // Carga el sonidos
  soundFormats('mp3', 'ogg');
  sonidoColision = loadSound('acierto.mp3');
  endsound = loadSound('chester.mp3')
  failshoot = loadSound('fail.mp3')
  musicaFondo = loadSound('FondoMusic.mp3');
  musicaFondo.setVolume(0.3);

  // Carga la fuente personalizada
  customFont = loadFont('CHEESEBU.ttf'); 

   // Carga la imagen de la mira
   miradisparo = loadImage('mira.png', img => {
    // Redimensiona la imagen para que tenga un tamaño más manejable
    anchoMira = 150; // ajusta el ancho a tu preferencia
    altoMira = (img.height / img.width) * anchoMira; // mantiene la proporción original

    // Ahora puedes usar anchoMira y altoMira para dibujar la mira
  });
}

function setup() {
  createCanvas(windowWidth / 3, windowHeight); // Tamaño del lienzo

  x = width / 2; // Inicializa la posición X al centro
  y = height / 30; // Inicializa la posición Y arriba
  posx = width / 2;
  posy = height / 4;

  musicaFondo.loop();

  // Cambia el tamaño de la imagen al tamaño deseado
  img.resize(tamanoImagen, tamanoImagen);
  tiempoInicio = millis(); // Guarda el tiempo de inicio

  // Redimensiona la nueva imagen al mismo tamaño que la imagen base
  nuevaImg.resize(tamanoImagen, tamanoImagen);

  // Disparo
  bolita = new Bolita(width / 2, height / 2);
  mira = new Mira();
  console.log("La posición de la mira en setup es:", posx, posy);
}

class Bolita {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.diametro = 60;
    this.disparada = false;
  }

  update() {
    this.pos.add(this.vel);
  }

  display() {
    const xOffset = this.diametro / 2; // Ajusta el desplazamiento horizontal
    const yOffset = this.diametro / 2; // Ajusta el desplazamiento vertical
    image(imgCheto, this.pos.x - xOffset, this.pos.y - yOffset); // Muestra la imagen centrada horizontal y verticalmente 
    ellipse(this.pos.x, this.pos.y, this.diametro);
  }

  //gpt ayudando, ahora sí!
  disparar() {
    if (!this.disparada) {
      // Calcula la dirección hacia las coordenadas de la mira
      const direccion = createVector(posx - this.pos.x, posy - this.pos.y).normalize();
      this.vel = direccion.mult(velocidadDisparo); // Establece la velocidad de disparo
      this.disparada = true;
    }
  }
}

class Mira {
  constructor() {
    //sí, aquí no va nada a-
  }

  update() {
  //sí, aquí tampoco va nada--
  }

  display() {
    // Dibuja la bolita-boliqueso
    noFill();
    stroke(0);
    strokeWeight(2);
  }
}

//=======================================================================================================
//SOCKET - JOYSTICK POSITIONS

socket.on('joystick', message => {
  const { x, y, button } = message;
  //console.log("recibido: ", message);

  if (x > 500) {
    posx -= velocidad
  }
  if (x < 530) {
    posx += velocidad
  }
  if (y < 500) {
    posy -= velocidad
  }
  if (y > 500) {
    posy += velocidad
  }

  //socket.broadcast.emit("movió joystick", message)
})

socket.on("confirmation")

function draw() {
  //Mostrar el juego (no-detenido)
  if (!juegoDetenido) {
    //===================================================================
    //Fondo del mupi
    image(fondoMupi, 0, 0, width, height)

    //====================================================================
    drawPhone();
    drawCheetos();

    // Verifica la colisión
    verificarColision();

     // Llama a la función update()
     update();

    // Mostrar puntaje actual
    textFont(customFont); // Establece la fuente personalizada
    textSize(50); // Tamaño del texto
    fill(255); // Color del texto
    textAlign(LEFT);
    text(`Score: ${puntaje} `, 20, 40); // Dibuja el texto del puntaje

    tiempoTranscurrido = millis() - tiempoInicio;
    tiempoRestante = tiempoJuego - tiempoTranscurrido;

    // Mostrar tiempo restante
    let segundosRestantes = Math.ceil(tiempoRestante / 1000); // Convierte a segundos y redondea hacia arriba
    textSize(50);
    fill(255);
    textAlign(LEFT);
    text(`Time Left: ${segundosRestantes} seconds`, 20, 80); // Muestra el tiempo restante

    if (mostrarBien) {
      textSize(80); // Tamaño del texto del aviso
      fill(0, 255, 0); // Color del texto del aviso (verde)
      textAlign(CENTER, CENTER);
      text("Nice!", width / 2 - 50, height / 4); // Dibuja el aviso "Bien!"
    }
    if (mostrarFallo) {
      textSize(70); // Tamaño del texto del aviso
      fill(255, 0, 0); // Color del texto del aviso (rojo)
      textAlign(CENTER, CENTER);
      text("Try again!", width / 2 - 50, height / 4); // Dibuja el aviso "Bien!"
    }

    let tiempoActual = millis();
    if (tiempoActual - lastSpeedIncrease >= 10000 && velocidadX < 16) {
      lastSpeedIncrease = tiempoActual; // Actualiza el registro del tiempo
      aumentarVelocidad(); // Llama a la función para aumentar la velocidad
    }

    if (mostrarNuevaImagen) {
      // Verificar si ha pasado 1 segundo desde que se mostró la nueva imagen
      let tiempoTranscurridoNuevaImg = millis() - tiempoInicioNuevaImg;
      if (tiempoTranscurridoNuevaImg >= 1000) {
        mostrarNuevaImagen = false;
      }
    } else {
      drawCheetos();
    }

    //===================================================================
    //Acomodar imáagen al centro de posx y posy
    image(miradisparo, posx - anchoMira / 2, posy - altoMira / 2, anchoMira, altoMira);

    // Controla la duración del aviso "Bien!"
    if (mostrarBien) {
      bienTimer--;
      if (bienTimer <= 0) {
        mostrarBien = false;
        bienTimer = 30; // Reinicia el temporizador
      }
    }
    if (mostrarFallo) {
      FalloTimer--;
      if (FalloTimer <= 0) {
        mostrarFallo = false;
        FalloTimer = 30; // Reinicia el temporizador
      }
    }
  } else {
    // Muestra solo el puntaje cuando el juego está detenido
    background(0); // Fondo negro
    textSize(50);
    fill(255);
    textAlign(CENTER, CENTER);
    text(`That's all! Your score: ${puntaje}`, width / 2, height / 2); // Muestra el puntaje en el centro
  }

  tiempoTranscurrido = millis() - tiempoInicio;

  //Detener el juego a x milisegundos
  if (tiempoTranscurrido >= 50000 && !juegoDetenido) {
    juegoDetenido = true;
    endsound.play();
    musicaFondo.stop();
  }
}

function update() {
  x += velocidadX * direccion;

  // Comprueba si la imagen ha alcanzado el borde derecho o izquierdo y cambia la dirección
  if (x + tamanoImagen > width) {
    direccion = -1; // Cambia la dirección a izquierda
  } else if (x < 0) {
    direccion = 1; // Cambia la dirección a derecha
  }

// Restringe el movimiento de la mira en el eje X
if (posx + 57 > width) {
  posx = width - 57; // Ajusta la posición para que no se salga a la derecha
} else if (posx < 57) {
  posx = 57; // Ajusta la posición para que no se salga a la izquierda
}

// Restringe el movimiento de la mira en el eje Y
if (posy + 57 > height) {
  posy = height - 57; // Ajusta la posición para que no se salga hacia abajo
} else if (posy < 57) {
  posy = 57; // Ajusta la posición para que no se salga hacia arriba
}
}

//COORDENADAS DEL JOYSTICK
function drawCheetos() {
  //=========================================================================
  if (mostrarNuevaImagen) {
    image(nuevaImg, x, y); // Mostrar la nueva imagen si se debe mostrar
  } else {
    image(img, x, y); // Mostrar la imagen original
  }
}

function drawPhone() {
  // Control del movimiento automático de la mira
  mira.update(); // Actualiza la mira
  mira.display();
  bolita.update();
  bolita.display();

  if (bolita.pos.x < 0 || bolita.pos.x > width || bolita.pos.y < 0 || bolita.pos.y > height) {
    bolita.pos = createVector(width / 2, height / 2); // Restablecer posición inicial
    bolita.vel = createVector(0, 0); // Restablecer velocidad
    bolita.disparada = false; // Permitir otro disparo
    mostrarFallo = true; //Mostrar anuncio de fallaste
    failshoot.play();
  }
}

function verificarColision() {
  // Calcula la distancia entre el centro de la bolita y el centro de la imagen
  const distancia = dist(bolita.pos.x, bolita.pos.y, x + tamanoImagen / 2, y + tamanoImagen / 2);
  // Si la distancia es menor que el radio de la bolita, hay colisión
  if (distancia < bolita.diametro / 2 + tamanoImagen / 2) {
    // Aumenta el puntaje
    puntaje++;
    sonidoColision.play();

    // Muestra el aviso "Bien!" durante medio segundo
    mostrarBien = true;
    mostrarNuevaImagen = true; // Mostrar la nueva imagen
    tiempoInicioNuevaImg = millis(); // Guardar el tiempo de inicio de la nueva imagen

    // Restablece la posición de la bolita
    bolita.pos = createVector(width / 2, height / 2);
    bolita.vel = createVector(0, 0);
    bolita.disparada = false;
  }
}

function aumentarVelocidad() {
  velocidadX += 4; // Aumenta la velocidad en 5 unidades cada 10 segundos
}

function mousePressed() {
  bolita.disparar({ posx, posy }); // Dispara la bolita en dirección de la imágen de mira
}

//==========================================================================
//INTENTO CONEXIÓN SOCKET
let info = "Todavía na"

socket.on('confirmation', (data) => {
  info = data
})


/*let info = "Connected"

socket.on('confirmation', (data) => {
  info = data
})*/

//========================================================
//prueba de teclas
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    posx -= velocidad
  } else if (keyCode === RIGHT_ARROW) {
    posx += velocidad
  } else if (keyCode === UP_ARROW) {
    posy -= velocidad
  } else if (keyCode === DOWN_ARROW) {
    posy += velocidad
  }
}