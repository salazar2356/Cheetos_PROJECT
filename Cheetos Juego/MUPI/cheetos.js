let img; // Variable para la imagen
let x, y; // Coordenadas de la imagen
let tiempoInicio;
let velocidadX = 10; // Velocidad inicial en el eje X en píxeles por milisegundo
let tamanoImagen = 300; // Tamaño de la imagen en píxeles (ancho y alto)
let direccion = 1; // Dirección del movimiento (1 para derecha, -1 para izquierda)
let lastSpeedIncrease = 0; // Registro del tiempo de la última aceleración

// PHONE
let bolita;
let mira;
let miraDirection = 1;
let velocidadDisparo = 29;

let puntaje = 0; // Variable para el puntaje
let customFont; // Variable para la fuente personalizada

let mostrarBien = false; // Variable para controlar el aviso "Bien!"
let bienTimer = 30; // Duración del aviso en cuadros (medio segundo)

let mostrarFallo = false; // Variable para controlar el aviso "Intenta de nuevo!"
let FalloTimer = 30; // Duración del aviso en cuadros (medio segundo)

function preload() {
  // Carga la imagen antes de ejecutar el sketch
  img = loadImage('chesterb.png');

  // Carga la fuente personalizada
  customFont = loadFont('CHEESEBU.ttf'); // Asegúrate de que la fuente esté en la misma carpeta que el archivo HTML y JS
}

function setup() {
  createCanvas(1300, 1700); // Tamaño del lienzo
  x = width / 2; // Inicializa la posición X al centro
  y = height / 30; // Inicializa la posición Y arriba

  // Cambia el tamaño de la imagen al tamaño deseado
  img.resize(tamanoImagen, tamanoImagen);

  // PHONE
  bolita = new Bolita(width / 2, height / 2);
  mira = new Mira();
}

function draw() {
  background(255, 165, 0);

  drawPhone();
  drawCheetos();

  // Verifica la colisión
  verificarColision();

  // Usa la fuente personalizada para el puntaje
  textFont(customFont); // Establece la fuente personalizada
  textSize(50); // Tamaño del texto
  fill(255); // Color del texto
  text(`Score: ${puntaje}`, 20, 40); // Dibuja el texto del puntaje

  if (mostrarBien) {
    textSize(80); // Tamaño del texto del aviso
    fill(0, 255, 0); // Color del texto del aviso (verde)
    text("Nice!", width / 2 - 50, height / 4); // Dibuja el aviso "Bien!"
  }
  if (mostrarFallo) {
    textSize(70); // Tamaño del texto del aviso
    fill(255, 0, 0); // Color del texto del aviso (rojo)
    text("Try again!", width / 2 - 50, height / 4); // Dibuja el aviso "Bien!"
  }

  // Llama a la función update()
  update();

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
}

function update() {
  x += velocidadX * direccion;

  // Comprueba si la imagen ha alcanzado el borde derecho o izquierdo y cambia la dirección
  if (x + tamanoImagen > width) {
    direccion = -1; // Cambia la dirección a izquierda
  } else if (x < 0) {
    direccion = 1; // Cambia la dirección a derecha
  }
}

function drawCheetos() {
  image(img, x, y); // Muestra la imagen en las coordenadas (x, y)
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
  }
}
function verificarColision() {
  // Calcula la distancia entre el centro de la bolita y el centro de la imagen
  const distancia = dist(bolita.pos.x, bolita.pos.y, x + tamanoImagen / 2, y + tamanoImagen / 2);
  // Si la distancia es menor que el radio de la bolita, hay colisión
  if (distancia < bolita.diametro / 2 + tamanoImagen / 2) {
    // Aumenta el puntaje
    puntaje++;

    // Muestra el aviso "Bien!" durante medio segundo
    mostrarBien = true;

    // Restablece la posición de la bolita
    bolita.pos = createVector(width / 2, height / 2);
    bolita.vel = createVector(0, 0);
    bolita.disparada = false;
    }
  }

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function mousePressed() {
  bolita.disparar(mira); // Dispara la bolita en dirección de la mira
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
    fill(255, 140, 0);
    ellipse(this.pos.x, this.pos.y, this.diametro);
  }

  disparar(mira) {
    if (!this.disparada) {
      this.vel = p5.Vector.fromAngle(radians(-mira.angle)).mult(velocidadDisparo); // Utiliza el ángulo de la mira
      this.disparada = true;
    }
  }
}

class Mira {
  constructor() {
    this.angle = 0; // Inicialmente, el ángulo es 0 grados
    this.direction = PI / 1.5;
  }

  update() {
    // Control del movimiento automático de la mira
    this.angle += this.direction; // Incrementa o disminuye el ángulo (ajusta la velocidad a tu preferencia)

    // Cambia la dirección cuando llega a los límites
    if (this.angle <= 0 || this.angle >= 180) {
      this.direction *= -1; // Invierte la dirección
    }
  }

  display() {
    // Calcula las coordenadas del punto final de la línea en base al ángulo
    const x2 = width / 2 + cos(radians(-this.angle)) * 500; // 100 es la longitud de la línea
    const y2 = height / 2 + sin(radians(-this.angle)) * 500;

    // Dibuja la mira
    noFill();
    stroke(0);
    strokeWeight(2);
    setLineDash([10, 10]); //longer stitches
    line(width / 2, height / 2, x2, y2);
  }
}
