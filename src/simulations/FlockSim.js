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
        this.space = ''
    }

    draw(cx) {
        const p1 = new Vec2D.Vector(10, 0), p2 = new Vec2D.Vector(-5, 5), p3 = new Vec2D.Vector(-5, -5)
        const angle = this.velocity.angle()
        p1.rotate(angle).add(this.position)
        p2.rotate(angle).add(this.position)
        p3.rotate(angle).add(this.position)

        cx.beginPath()
        cx.fillStyle = '#0000FF'
        cx.moveTo(p1.x, p1.y)
        cx.lineTo(p2.x, p2.y)
        cx.lineTo(p3.x, p3.y)
        cx.fill()
    }
}

class FlockSimulation {

    init(canvas) {
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height

        this.birds = []
        for (let i = 0; i < 2500; i++) {
            const bird = new Bird()
            bird.init(canvas)
            this.birds.push(bird)
        }

        this.birdCount = 100

        this.setApproachDistance(30)
        this.setRepulseDistance(15)

        this.spaces = {}

        this.spaceSize = this.approachDistance

        this.flightSpeed = 50
        this.approachValue = 0.5
        this.repulseValue = 3
        
        this.centerX = canvas.width * 0.5
        this.centerY = canvas.height * 0.5

        this.centerAttractMinDist = 200
        this.centerAttractMaxDist = 300
        this.centerAttractMinDistSq = this.centerAttractMinDist * this.centerAttractMinDist
        this.centerAttractMaxDistSq = this.centerAttractMaxDist * this.centerAttractMaxDist
        this.centerAttarctValue = 1
    }

    setBirdCount(count) {
        this.birdCount = count
        if (this.birdCount === this.previousBirdCount) {
            return
        }
        if (this.birdCount < this.previousBirdCount) {
            this.spaces = {}
        }
        this.previousBirdCount = this.birdCount
    }

    setApproachDistance(distance) {
        this.approachDistance = distance
        this.approachSq = this.approachDistance * this.approachDistance
    }

    setRepulseDistance(distance) {
        this.repulseDisntance = distance
        this.repulseSq = this.repulseDisntance * this.repulseDisntance
    }

    flockBehaviour(bird, dt) {
        bird.velocity.unit().multiplyByScalar(this.flightSpeed)

        const spaceX = Math.floor(bird.position.x / this.spaceSize)
        const spaceY = Math.floor(bird.position.y / this.spaceSize)
        const spaceName = `${spaceX},${spaceY}`

        if (bird.space !== spaceName) {
            if (this.spaces.hasOwnProperty(bird.space)) {
                const space = this.spaces[bird.space]
                for( var i = 0; i < space.length; i++) { 
                    if ( space[i] === bird) {
                        space.splice(i, 1);
                        break
                    }
                }
            }
            bird.space = spaceName
            if (!this.spaces.hasOwnProperty(spaceName)) {
                this.spaces[spaceName] = []
            }
            if (!this.spaces[spaceName].includes(bird)) {
                this.spaces[spaceName].push(bird)
            }
        }

        const handleOther = (other) => {
            let offset = other.position.clone().subtract(bird.position)
            let distanceSq = offset.x * offset.x + offset.y * offset.y
            if (bird === other
                || distanceSq > this.approachSq) {
                    return
                }
            if (distanceSq < this.repulseSq) {
                offset.reverse().unit().multiplyByScalar(this.repulseValue)
            } else {
                offset = other.velocity.clone().unit().multiplyByScalar(this.approachValue)
            }
            bird.velocity.add(offset)
        }

        for (let x = spaceX - 1; x <= spaceX + 1; x++) {
            for (let y = spaceY - 1; y <= spaceY + 1; y++) {
                const name = `${x},${y}`
                if (this.spaces.hasOwnProperty(name)) {
                    this.spaces[name].forEach(handleOther)
                }
            }
        }
        /*for (let i = 0; i < this.birdCount; i++) {
            const other = this.birds[i]
            handleOther(other)
        }*/

        const centerOffsetX = this.centerX - bird.position.x
        const centerOffsetY = this.centerY - bird.position.y
        const centerDistanceSq = centerOffsetX * centerOffsetX + centerOffsetY * centerOffsetY

        if (centerDistanceSq > this.centerAttractMinDistSq) {
            bird.velocity.add(new Vec2D.Vector(centerOffsetX, centerOffsetY).unit().multiplyByScalar(this.centerAttarctValue))
        }

        bird.position.add(bird.velocity.multiplyByScalar(dt))
    }

    update(dt, cx) {
        for (let x = 0; x < this.birdCount; x++) {
            const bird = this.birds[x]
            this.flockBehaviour(bird, dt)
            bird.draw(cx)
        }
    }
}

const flockSim = () => {
    return new FlockSimulation()
    //return [...Array(10)].map(() => new Bird())
}

export default flockSim
