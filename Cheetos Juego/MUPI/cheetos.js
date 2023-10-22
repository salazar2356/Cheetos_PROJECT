let img; // Variable para la imagen
let x, y; // Coordenadas de la imagen
let tiempoInicio;
let velocidadX = 10; // Velocidad inicial en el eje X en píxeles por milisegundo
let aceleracion = 0.0003; // Aumento de velocidad en píxeles por milisegundo al cuadrado
let tamanoImagen = 300; // Tamaño de la imagen en píxeles (ancho y alto)
let direccion = 1; // Dirección del movimiento (1 para derecha, -1 para izquierda)
let lastSpeedIncrease = 0; // Registro del tiempo de la última aceleración

//PHONE
let bolita;
let mira;
let miraDirection = 1;
let velocidadDisparo = 29;

function preload() {
  // Carga la imagen antes de ejecutar el sketch
  img = loadImage('chesterb.png');
}

function setup() {
  createCanvas(1300, 1700);
  x = width / 2; // Inicializa la posición X al centro
  y = height / 30; // Inicializa la posición Y al centro
  tiempoInicio = millis(); // Registra el tiempo de inicio

  // Cambia el tamaño de la imagen al tamaño deseado
  img.resize(tamanoImagen, tamanoImagen);

  //Phone
  bolita = new Bolita(width / 2, height / 2);
  mira = new Mira();
}

function draw() {
  background(255, 0, 0);

  drawPhone();
  drawCheetos();


  image(cheetos, 0, 0);
  image(phone, 0, 0);
}

function drawCheetos() {
  cheetos = createGraphics(1300, 500); // Crea un lienzo de 1300x500 píxeles


  let tiempoTranscurrido = millis() - tiempoInicio;

  if (tiempoTranscurrido < 60000) { // 60000 milisegundos es igual a 1 minuto
    // Aumenta la velocidad cada 10 segundos
    if (tiempoTranscurrido - lastSpeedIncrease >= 10000) {
      velocidadX += 1.5; // Aumenta la velocidad en 0.1 píxeles por milisegundo
      lastSpeedIncrease = tiempoTranscurrido;
    }

    x += velocidadX * direccion;

    // Comprueba si la imagen ha alcanzado el borde derecho o izquierdo y cambia la dirección
    if (x + tamanoImagen > width) {
      direccion = -1; // Cambia la dirección a izquierda
    } else if (x < 0) {
      direccion = 1; // Cambia la dirección a derecha
    }

    cheetos.image(img, x, y); // Muestra la imagen en las coordenadas (x, y)
  }
  // La imagen se quedará quieta después de 1 minuto (60000 ms)
}

function drawPhone() {
  phone = createGraphics(900, 100);

  // Control del movimiento automático de la mira
  mira.update(); // Actualiza la mira
  mira.display();
  bolita.update();
  bolita.display();

  if (bolita.pos.x < 0 || bolita.pos.x > width || bolita.pos.y < 0 || bolita.pos.y > height) {
    bolita.pos = createVector(width / 2, height / 2); // Restablecer posición inicial
    bolita.vel = createVector(0, 0); // Restablecer velocidad
    bolita.disparada = false; // Permitir otro disparo
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
    fill(255, 165, 0);
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
    this.direction = PI/1,5;
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
