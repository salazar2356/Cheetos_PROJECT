let img; // Variable para la imagen
let x, y; // Coordenadas de la imagen
let tiempoInicio;
let velocidadX = 7; // Velocidad inicial en el eje X en píxeles por milisegundo
let aceleracion = 0.0003; // Aumento de velocidad en píxeles por milisegundo al cuadrado
let tamanoImagen = 200; // Tamaño de la imagen en píxeles (ancho y alto)
let direccion = 1; // Dirección del movimiento (1 para derecha, -1 para izquierda)
let lastSpeedIncrease = 0; // Registro del tiempo de la última aceleración

function preload() {
  // Carga la imagen antes de ejecutar el sketch
  img = loadImage('chesterb.png');
}

function setup() {
  createCanvas(1200, 500); // Crea un lienzo de 1300x500 píxeles
  x = width / 2; // Inicializa la posición X al centro
  y = height / 4; // Inicializa la posición Y al centro
  tiempoInicio = millis(); // Registra el tiempo de inicio

  // Cambia el tamaño de la imagen al tamaño deseado
  img.resize(tamanoImagen, tamanoImagen);
}

function draw() {
  background(220); // Fondo gris claro

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

    image(img, x, y); // Muestra la imagen en las coordenadas (x, y)
  }
  // La imagen se quedará quieta después de 1 minuto (60000 ms)
}
