// Definir Level1
// 1 = Muro
// 2 = Bloque rompible
// 3 = Jugador
let level = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 2, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 2, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 2, 1],
  [1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 2, 0, 2, 2],
  [1, 0, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1],
  [1, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1],
  [1, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2],
  [1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 2, 1],
  [1, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2],
  [1, 2, 1, 0, 1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1],
  [1, 2, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Crear una nueva imagen para el sprite sheet
var spriteSheet = new Image();
spriteSheet.src = "./sprites.png";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// Ancho y alto del canvas
canvas.width = 1050;
canvas.height = 545;

const cellSize = 42;
//DIBUJAR EL MAPA
function drawMap() {
  // Iterar sobre cada celda del mapa
  for (var i = 0; i < level.length; i++) {
    for (var j = 0; j < level[i].length; j++) {
      // Si el valor de la celda es 1 (pared), dibujar el sprite de la pared
      if (level[i][j] === 1) {
        // Calcular las coordenadas de dibujo en el canvas
        var x = j * cellSize;
        var y = i * cellSize;

        // Dibujar el sprite de la pared en el canvas
        ctx.drawImage(
          spriteSheet,
          48,
          48,
          15, // el tamaño del recorte
          15, // el tamaño del recorte
          x, // posición X del dibujo
          y, // posición X del dibujo
          cellSize, // ancho del dibujo
          cellSize // ancho del dibujo
        );
      } else if (level[i][j] === 2) {
        // Calcular las coordenadas de dibujo en el canvas
        var x = j * cellSize;
        var y = i * cellSize;

        // Dibujar el otro sprite en el canvas (cuando el valor de la celda es 2)
        ctx.drawImage(
          spriteSheet,
          64,
          48,
          15, // el tamaño del recorte
          15, // el tamaño del recorte
          x, // posición X del dibujo
          y, // posición X del dibujo
          cellSize, // ancho del dibujo
          cellSize // ancho del dibujo
        );
      }
    }
  }
}

// El jugador
class Player {
  constructor(xPlayer, yPlayer) {
    this.x = xPlayer;
    this.y = yPlayer;
    this.width = 32;
    this.height = 32;
    this.speed = 1;

    // VARIABLES MOVIMIENTO DEL JUGADOR
    this.rightPressed = false;
    this.leftPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.direction = "right";

    this.playerAnimationFrame = 0; // Índice de la animación del jugador
    this.playerAnimationCounter = 0; // Contador para controlar la velocidad de la animación

    // VARIABLES BOMBAS
    //this.bombX = -100; // Inicialmente fuera del canvas
    //this.bombY = -100; // Inicialmente fuera del canvas
    this.bombs = [];
  }
  draw() {
    // Coordenadas de recorte para la animación de la izquierda (simplemente invierte las coordenadas X)
    const leftAnimationCoordinates = [
      [0, 0], // Sprite para la izquierda - Frame 1
      [16, 0], // Sprite para la izquierda - Frame 2
      [32, 0], // Sprite para la izquierda - Frame 3
    ];
    // Coordenadas de recorte para la animación hacia la derecha
    const rightAnimationCoordinates = [
      [0, 16], // Sprite para la derecha - Frame 1
      [16, 16], // Sprite para la derecha - Frame 2
      [32, 16], // Sprite para la derecha - Frame 3
    ];
    // Coordenadas de recorte para la animación hacia arriba
    const upAnimationCoordinates = [
      [48, 16], // Sprite para la izquierda - Frame 1
      [64, 16], // Sprite para la izquierda - Frame 2
      [80, 16], // Sprite para la izquierda - Frame 3
    ];
    // Coordenadas de recorte para la animación hacia arriba
    const downAnimationCoordinates = [
      [48, 0], // Sprite para la izquierda - Frame 1
      [64, 0], // Sprite para la izquierda - Frame 2
      [80, 0], // Sprite para la izquierda - Frame 3
    ];

    // Si la animación está activa, seleccionar las coordenadas de recorte adecuadas para la animación
    let animationCoordinates = rightAnimationCoordinates;

    if (this.direction === "left") {
      animationCoordinates = leftAnimationCoordinates;
    } else if (this.direction === "right") {
      animationCoordinates = rightAnimationCoordinates;
    } else if (this.direction === "up") {
      animationCoordinates = upAnimationCoordinates;
    } else if (this.direction === "down") {
      animationCoordinates = downAnimationCoordinates;
    }

    // Dibujar el sprite del jugador con las coordenadas de recorte adecuadas
    ctx.drawImage(
      spriteSheet,
      animationCoordinates[this.playerAnimationFrame][0],
      animationCoordinates[this.playerAnimationFrame][1],
      16, // Ancho del sprite recortado
      16, // Alto del sprite recortado
      this.x,
      this.y,
      32, // Ancho del sprite dibujado
      32 // Alto del sprite dibujado
    );

    // Controlar la velocidad de la animación si está activa
    if (
      this.leftPressed ||
      this.rightPressed ||
      this.upPressed ||
      this.downPressed
    ) {
      this.playerAnimationCounter++;
      if (this.playerAnimationCounter >= 10) {
        // Ajusta este valor para cambiar la velocidad de la animación
        this.playerAnimationCounter = 0;
        this.playerAnimationFrame = (this.playerAnimationFrame + 1) % 3; // Modifica este valor si cambias la cantidad de frames en la animación
      }
    }
  }

  movement() {
    let nextPlayerX = this.x;
    let nextPlayerY = this.y;

    const nextGridXRight = Math.floor((this.x + this.width + 2) / cellSize);
    const nextGridXLeft = Math.floor((this.x - 1) / cellSize);
    const nextGridYUp = Math.floor((this.y - 1) / cellSize);
    const nextGridYDown = Math.floor((this.y + this.height + 2) / cellSize);

    if (this.rightPressed && this.x < canvas.width - this.width - cellSize) {
      if (
        this.canMoveTo(nextGridXRight, Math.floor(this.y / cellSize)) &&
        this.canMoveTo(
          nextGridXRight,
          Math.floor((this.y + this.height - 1) / cellSize)
        ) &&
        !this.isCollidingWithBomb(this.x + this.speed, this.y)
      ) {
        nextPlayerX += this.speed;
      }
    } else if (this.leftPressed && this.x > cellSize) {
      if (
        this.canMoveTo(nextGridXLeft, Math.floor(this.y / cellSize)) &&
        this.canMoveTo(
          nextGridXLeft,
          Math.floor((this.y + this.height - 1) / cellSize)
        ) &&
        !this.isCollidingWithBomb(this.x - this.speed, this.y)
      ) {
        nextPlayerX -= this.speed;
      }
    } else if (this.upPressed && this.y > cellSize) {
      if (
        this.canMoveTo(Math.floor(this.x / cellSize), nextGridYUp) &&
        this.canMoveTo(
          Math.floor((this.x + this.width - 1) / cellSize),
          nextGridYUp
        ) &&
        !this.isCollidingWithBomb(this.x, this.y - this.speed)
      ) {
        nextPlayerY -= this.speed;
      }
    } else if (
      this.downPressed &&
      this.y < canvas.height - this.height - cellSize
    ) {
      if (
        this.canMoveTo(Math.floor(this.x / cellSize), nextGridYDown) &&
        this.canMoveTo(
          Math.floor((this.x + this.width - 1) / cellSize),
          nextGridYDown
        ) &&
        !this.isCollidingWithBomb(this.x, this.y + this.speed)
      ) {
        nextPlayerY += this.speed;
      }
    }

    if (!this.isCollidingWithObstacle(nextPlayerX, nextPlayerY)) {
      this.x = nextPlayerX;
      this.y = nextPlayerY;
    }
  }

  isCollidingWithBomb(x, y) {
    for (let i = 0; i < this.bombs.length; i++) {
      const bombX = this.bombs[i][0];
      const bombY = this.bombs[i][1];
      // Verificar si la posición del jugador está dentro del área de la bomba
      if (
        x + this.width >= bombX &&
        x <= bombX + cellSize &&
        y + this.height >= bombY &&
        y <= bombY + cellSize
      ) {
        return true;
      }
    }
    return false;
  }

  canMoveTo(gridX, gridY) {
    return level[gridY][gridX] !== 1 && level[gridY][gridX] !== 2;
  }

  isCollidingWithObstacle(x, y) {
    const i = Math.floor(y / cellSize);
    const j = Math.floor(x / cellSize);
    return level[i][j] === 1 || level[i][j] === 2;
  }

  drawBomb() {
    // Dibujar la bomba
    for (let i = 0; i < this.bombs.length; i++) {
      console.log(this.bombs[i]);
      ctx.drawImage(
        spriteSheet,
        32,
        48,
        15, // el tamaño del recorte
        15, // tamaño del recorte
        this.bombs[i][0], // posición X del dibujo
        this.bombs[i][1], // posición Y del dibujo
        40, // ancho del dibujo
        40 // alto del dibujo
      );
    }
  }
  placeBomb() {
    console.log("pulsado space");

    if (this.direction === "right") {
      this.bombs.push([this.x + cellSize, this.y]); // Colocar la bomba en la posición actual del jugador en X
    } else if (this.direction === "left") {
      this.bombs.push([this.x - cellSize, this.y]); // Colocar la bomba en la posición actual del jugador en X
    } else if (this.direction === "up") {
      this.bombs.push([this.x, this.y - cellSize]); // Colocar la bomba en la posición actual del jugador en Y
    } else if (this.direction === "down") {
      this.bombs.push([this.x, this.y + cellSize]);
    }

    // Después de 5 segundos, eliminar la bomba
    // Suponiendo que `this.bombs` es un array que contiene las coordenadas de las bombas

    for (let i = 0; i < this.bombs.length; i++) {
      // Usamos una función dentro de un bucle para capturar el valor actual de `i`
      let bombsArray = this.bombs;
      setTimeout(
        function (index) {
          // Para cada bomba, creamos un temporizador que las elimine después de 3 segundos
          bombsArray.splice(index, 1); // Eliminar la bomba en la posición `index`
          console.log("Bomba eliminada:", index);
        }.bind(this, i),
        3000
      ); // Usamos bind para pasar el valor actual de `i` y mantener el contexto de `this`
    }
  }
}

const player = new Player(42, 42);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// INICIAR EVENTOS
function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
}

function keyDownHandler(event) {
  const { key } = event;
  if (key === "Right" || key === "ArrowRight" || key.toLowerCase() === "d") {
    player.rightPressed = true;
    player.direction = "right";
  } else if (
    key === "Left" ||
    key === "ArrowLeft" ||
    key.toLowerCase() === "a"
  ) {
    player.leftPressed = true;
    player.direction = "left";
  } else if (key === "Up" || key === "ArrowUp" || key.toLowerCase() === "w") {
    player.upPressed = true;
    player.direction = "up";
  } else if (
    key === "Down" ||
    key === "ArrowDown" ||
    key.toLowerCase() === "s"
  ) {
    player.downPressed = true;
    player.direction = "down";
  } else if (key === " " || key.toLowerCase() === "space") {
    player.placeBomb(); // Llamar a la función cuando se presiona la tecla espacio
  }
}

function keyUpHandler(event) {
  const { key } = event;
  if (key === "Right" || key === "ArrowRight" || key.toLowerCase() === "d") {
    player.rightPressed = false;
  } else if (
    key === "Left" ||
    key === "ArrowLeft" ||
    key.toLowerCase() === "a"
  ) {
    player.leftPressed = false;
    //player.isAnimatingLeft = false;
  } else if (key === "Up" || key === "ArrowUp" || key.toLowerCase() === "w") {
    player.upPressed = false;
  } else if (
    key === "Down" ||
    key === "ArrowDown" ||
    key.toLowerCase() === "s"
  ) {
    player.downPressed = false;
  }
}

function game() {
  requestAnimationFrame(game);

  clearCanvas();

  drawMap();

  player.draw();
  player.movement();
  player.drawBomb();
}

game();
initEvents();
