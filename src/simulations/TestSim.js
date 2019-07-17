class Ball {

    init(canvas) {
        this.canvas = canvas
        this.bX = 30 + Math.random() * 200
        this.bY = 30 + Math.random() * 200
        this.mX = 1 + Math.random() * 10
        this.mY = 1 + Math.random() * 10
        this.dX = Math.random() >= 0.5 ? 1 : -1
        this.dY = Math.random() >= 0.5 ? 1 : -1
        this.cw = canvas.width
        this.ch = canvas.height
    }

    update(dt, cx) {
        cx.beginPath();
        cx.fillStyle = 'red';
        cx.arc(this.bX, this.bY, 20, 0, Math.PI * 360);
        cx.fill();
        if (this.bX >= this.cw) { this.dX = -1 }
        if (this.bY >= this.ch) { this.dY = -1 }
        if (this.bX <= 0) { this.dX = 1 }
        if (this.bY <= 0) { this.dY = 1 }

        this.bX += (this.mX + this.canvas.counter * 15) * this.dX * dt;
        this.bY += (this.mY + this.canvas.counter * 15) * this.dY * dt;
    }
}

const testSim = () => {
    return [...Array(10)].map(() => new Ball())
}

export default testSim
