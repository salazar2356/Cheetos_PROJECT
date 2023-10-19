let bolita;
let mira;
let miraDirection = 1;
let velocidadDisparo = 24;

function setup() {
  createCanvas(400, 400);
  bolita = new Bolita(width / 2, height / 2);
  mira = new Mira();
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function draw() {
  background(220);
 

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

function mousePressed() {
  bolita.disparar(mira); // Dispara la bolita en dirección de la mira
}

class Bolita {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.diametro = 20;
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
    this.direction = PI/3;
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
    const x2 = width / 2 + cos(radians(-this.angle )) * 500; // 100 es la longitud de la línea
    const y2 = height / 2 + sin(radians(-this.angle )) * 500;
    
    // Dibuja la mira
    noFill();
    stroke(0);
    strokeWeight(2);
    setLineDash([10, 10]); //longer stitches
    line(width / 2, height / 2, x2, y2);
  }
}