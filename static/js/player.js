/*
 * Class Player
 * @param {object} id
 * @param {string} name
 * @param {int} health
 * @param {int} power
 */

class Player {
  constructor(id, name, health, power) {
    this.id = id;
    this.x = 600;
    this.y = 850;
    this.name = name;
    this.health = health;
    this.power = power;
    this.bullets = [];
  }

  display() {
    // Left and Right boundaries
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > 1150) {
      this.x = 1150;
    }

    // Top and Bottom boundaries
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > 850) {
      this.y = 860;
    }

    this.id.style.left = this.x + "px";
    this.id.style.top = this.y + "px";
  }

  // Move the player
  move(event) {
    switch (event) {
      case 87:
        this.y -= 10; // Up or W
        break;
      case 83:
        this.y += 10; // Down or S
        break;
      case 65:
        this.x -= 10; // Left or A
        break;
      case 68:
        this.x += 10; // Right or D
        break;
      case 32:
        this.fire();
        break;
    }
  }

  // fire a bullet
  fire() {
    console.log("fire");
    this.bullets.push({ x: this.x + 441, y: this.y + 15});
  }

  // update the bullets
  displaybullets() {
    let output = "";
    for (let bullet of this.bullets) {
      console.log("Bullet Pos:", bullet.x, bullet.y);
      output +=
        "<div class='sprite-bullet' style='top:" +
        bullet.y +
        "px; left:" +
        bullet.x +
        "px;'></div>";
    }
    document.getElementById("bullets").innerHTML = output;
  }
}

const hero = document.getElementById("hero");
const player = new Player(hero, "Player 1", 100, 10);

function moveBullets() {
  for (let bullet of player.bullets) {
    bullet.y -= 5;
    if (bullet.y < 30) {
      player.bullets.shift();
    }
  }
}

function gameLoop() {
  player.displaybullets();
  moveBullets();
}

function eventKeyDown(event) {
  player.move(event.keyCode);
  player.display();
}

var startGame = setInterval(gameLoop, 30);
document.addEventListener("keydown", eventKeyDown);
