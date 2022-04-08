var player = null; //global variable player

document.addEventListener("DOMContentLoaded", function () {
  /*
   * Class Player
   * @param {object} id
   * @param {string} name
   * @param {int} health
   * @param {int} power
   */
  class Player {
    constructor(id, name, health, score) {
      this.id = id;
      this.x = 400;
      this.y = 550;
      this.name = name;
      this.health = health;
      this.score = score;
      this.bullets = [];
    }
  }

  class Enemy {
    constructor(x, y, speed, type) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.type = type;
    }
  }

  let name = prompt("Enter your name");

  const socket = io();
  const div = document.getElementById("container");
  const onlineList = document.getElementById("online-list");
  let elementPlayer = null;
  let pos = { x: 0, y: 0 };

  socket.on("connect", function () {
    player = new Player(socket.id, name, 100, 0);

    // create element for player
    let playerDiv = document.createElement("div");
    playerDiv.id = player.id;
    playerDiv.className = "sprite-hero";
    playerDiv.innerHTML = `<span class=nametag>${player.name}</span>`;
    playerDiv.style.left = player.x + "px";
    playerDiv.style.top = player.y + "px";

    // add the playerDiv to container
    div.appendChild(playerDiv);

    // send player to server
    socket.emit("newPlayer", { newPlayer: player });

    // set the player's position to variable pos
    pos.x = player.x;
    pos.y = player.y;

    // get the player's element and set the it to elementPlayer
    elementPlayer = document.getElementById(player.id);
  });

  // check winner
  socket.on("winner", (data) => {
    alert(`${data.winnerUser.name} won the game!`);
    location.reload();
  });

  // display active users
  socket.on("displayActiveUsers", (data) => {
    onlineList.innerHTML = "";
    let users = data.users;
    for (let user of users) {
      let onlineListItem = document.createElement("li");
      onlineListItem.id = "_" + user.id;
      onlineListItem.innerHTML = `${user.name} - ${user.score}`;
      onlineList.appendChild(onlineListItem);
    }
  });

  function eventMovePlayer(event) {
    switch (event.keyCode) {
      case 87:
        pos.y -= 10; // Up or W
        break;
      case 83:
        pos.y += 10; // Down or S
        break;
      case 65:
        pos.x -= 10; // Left or A
        break;
      case 68:
        pos.x += 10; // Right or D
        break;
      case 32:
        // spacebar
        eventFireBullet();
        drawBullets();

        break;
      default:
        console.log("Invalid Key");
        break;
    }
    // check boundaries then move player if not out of bounds
    checkBoundaries();
  }

  // fire event when player presses spacebar
  function eventFireBullet() {
    player.bullets.push({ x: player.x + 46, y: player.y + 10 });
  }
  // draw bullets
  function drawBullets() {
    let output = "";
    for (let bullet of player.bullets) {
      output += `<div class="sprite-bullet" 
                 style="left:${bullet.x}px;
                 top:${bullet.y}px;">
                 </div>`;
    }
    document.getElementById("bullets").innerHTML = output;
  }

  function moveBullets() {
    for (let bullet of player.bullets) {
      bullet.y -= 1;
      if (bullet.y < 20 && player.bullets.length > 0) {
        player.bullets.shift();
      }
      drawBullets();
    }
  }

  function checkBoundaries() {
    if (pos.x < 0) {
      pos.x = 0;
    } else if (pos.x > 850) {
      pos.x = 850;
    }

    if (pos.y < 0) {
      pos.y = 0;
    } else if (pos.y > 560) {
      pos.y = 560;
    }

    // set the element's position to pos and obj player's position to pos
    elementPlayer.style.left = pos.x + "px";
    elementPlayer.style.top = pos.y + "px";
    player.x = pos.x;
    player.y = pos.y;
  }

  // event listener for keydown
  document.addEventListener("keydown", eventMovePlayer);

  // Enemies class

  const enemyTypes = ["sprite-enemy1", "sprite-enemy2", "sprite-enemy3"];
  const speeds = [5, 6, 7, 8, 9, 10, 11, 12];
  var enemies = [];

  // create enemies
  for (let i = 0; i < 10; i++) {
    let x = Math.floor(Math.random() * (860 - 100) + 100);
    let y = 30;
    let speed = speeds[Math.floor(Math.random() * speeds.length)];
    let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    enemies.push(new Enemy(x, y, speed, type));
  }

  // display enemies
  function drawEnemies() {
    let output = "";
    for (let enemy of enemies) {
      output += `<div class="${enemy.type}" 
                    style="left:${enemy.x}px;
                    top:${enemy.y}px;">
                    </div>`;
    }
    document.getElementById("enemies").innerHTML = output;
  }

  function moveEnemies() {
    for (let enemy of enemies) {
      enemy.y += enemy.speed;
      drawEnemies();
      if (enemy.y > 600) {
        enemy.y = 30;
        enemy.x = Math.floor(Math.random() * (860 - 100) + 100);
      }
    }
  }

  // Collision detection
  function checkCollision() {
    for (let enemy of enemies) {
      for (let bullet of player.bullets) {
        if (
          bullet.x > enemy.x &&
          bullet.x < enemy.x + 20 &&
          bullet.y > enemy.y &&
          bullet.y < enemy.y + 20
        ) {
          // restart the enemy
          enemy.y = 30;
          enemy.x = Math.floor(Math.random() * (860 - 100) + 100);

          player.score += 100;
          document.getElementById("scoretag").innerHTML = player.score;

          socket.emit("updateScore", { score: player.score, id: player.id });
          socket.on("displayScore", (data) => {
            for (let user of data.users) {
              let userDiv = document.getElementById("_" + user.id);
              userDiv.innerHTML = `${user.name} - ${user.score}`;
            }
          });
        }
      }
    }
  }

  setInterval(() => {
    moveBullets();
    checkCollision();
  }, 2);
  setInterval(moveEnemies, 40);
});
