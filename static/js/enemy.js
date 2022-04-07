class Enemy {
    constructor(id, x, y, speed, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.type = type;
    }

    displayEnemy() {
        this.id.style.left = this.x + "px";
        this.id.style.top = this.y + "px";
    }
}

