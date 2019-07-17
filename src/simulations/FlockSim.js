import * as Vec2D from 'vector2d'

Vec2D.Vector.prototype.rotate = function(angle) {
    const x = this._x, y = this._y
    this._x = x * Math.cos(angle) - y * Math.sin(angle)
    this._y = x * Math.sin(angle) + y * Math.cos(angle)
    return this
}

Vec2D.Vector.prototype.angle = function() {
    return Math.atan2(this._y, this._x)
}

class Bird {

    init(canvas) {
        this.canvas = canvas
        this.position = new Vec2D.Vector(Math.random() * canvas.width, Math.random() * canvas.height)
        this.velocity = new Vec2D.Vector(-5 + Math.random() * 10, -5 + Math.random() * 10)
        this.cw = canvas.width
        this.ch = canvas.height
    }

    update(dt, cx) {
        this.draw(cx)
        if (this.position.x >= this.cw && this.velocity.x > 0) { this.velocity.x *= -1 }
        if (this.position.y >= this.ch && this.velocity.y > 0) { this.velocity.y *= -1 }
        if (this.position.x <= 0 && this.velocity.x < 0) { this.velocity.x *= -1 }
        if (this.position.y <= 0 && this.velocity.y < 0) { this.velocity.y *= -1 }

        this.position.add(this.velocity.clone().multiplyByScalar(this.canvas.counter * 2 * dt))
    }

    draw(cx) {
        const p1 = new Vec2D.Vector(10, 0), p2 = new Vec2D.Vector(-5, 5), p3 = new Vec2D.Vector(-5, -5)
        const angle = this.velocity.angle()
        p1.rotate(angle).add(this.position)
        p2.rotate(angle).add(this.position)
        p3.rotate(angle).add(this.position)

        cx.beginPath();
        cx.fillStyle = 'red';
        cx.moveTo(p1.x, p1.y);
        cx.lineTo(p2.x, p2.y);
        cx.lineTo(p3.x, p3.y);
        cx.fill();
    }
}

class FlockSimulation {

    init(canvas) {
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height

        this.birds = []
        for (let i = 0; i < 100; i++) {
            const bird = new Bird()
            bird.init(canvas)
            this.birds.push(bird)
        }

        this.approachDistance = 30
        this.repulseDisntance = 15

        this.spaceSize = this.approachDistance

        this.flightSpeed = 50
        this.approachValue = 0.5
        this.repulseValue = 3

        this.approachSq = this.approachDistance * this.approachDistance
        this.repulseSq = this.repulseDisntance * this.repulseDisntance

        this.centerX = canvas.width * 0.5
        this.centerY = canvas.height * 0.5

        this.centerAttractMinDist = 100
        this.centerAttractMaxDist = 300
        this.centerAttractMinDistSq = this.centerAttractMinDist * this.centerAttractMinDist
        this.centerAttractMaxDistSq = this.centerAttractMaxDist * this.centerAttractMaxDist
        this.centerAttarctValue = 1
    }

    flockBehaviour(bird, dt) {
        bird.velocity.unit().multiplyByScalar(this.flightSpeed)

        for (let other of this.birds) {
            let offset = other.position.clone().subtract(bird.position)
            let distanceSq = offset.x * offset.x + offset.y * offset.y
            if (bird === other
                || distanceSq > this.approachSq) {
                    continue
                }
            if (distanceSq < this.repulseSq) {
                offset.reverse().unit().multiplyByScalar(this.repulseValue)
            } else {
                offset = other.velocity.clone().unit().multiplyByScalar(this.approachValue)
            }
            bird.velocity.add(offset)
        }

        const centerOffsetX = this.centerX - bird.position.x
        const centerOffsetY = this.centerY - bird.position.y
        const centerDistanceSq = centerOffsetX * centerOffsetX + centerOffsetY * centerOffsetY

        if (centerDistanceSq > this.centerAttractMinDistSq) {
            bird.velocity.add(new Vec2D.Vector(centerOffsetX, centerOffsetY).unit().multiplyByScalar(this.centerAttarctValue))
        }

        bird.position.add(bird.velocity.multiplyByScalar(dt))
    }

    update(dt, cx) {
        this.birds.forEach(bird => {
            this.flockBehaviour(bird, dt)



            bird.draw(cx)
        })
    }
}

const flockSim = () => {
    return [new FlockSimulation()]
    //return [...Array(10)].map(() => new Bird())
}

export default flockSim
