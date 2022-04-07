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

  const socket = io();
  const div = document.getElementById("container");
  let player = null;
  let elementPlayer = null;
  let pos = { x: 0, y: 0 };

  socket.on("connect", () => {
    player = new Player(socket.id, "Player", 100, 0);

    // create element for player
    let playerDiv = document.createElement("div");
    playerDiv.id = player.id;
    playerDiv.className = "sprite-hero";
    playerDiv.innerHTML = `<span >${player.name}</span>`;
    playerDiv.style.left = player.x + "px";
    playerDiv.style.top = player.y + "px";

    // add the playerDiv to container
    div.appendChild(playerDiv);
    elementPlayer = document.getElementById(player.id);

    // set the player's position to variable pos
    pos.x = player.x;
    pos.y = player.y;
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
    player.bullets.push({ x: player.x + 46 , y: player.y + 10 });
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

  function loop() {
    moveBullets();
  }

  setInterval(loop, 2);

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
});
