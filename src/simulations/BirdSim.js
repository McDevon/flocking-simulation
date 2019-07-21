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

    constructor(canvas) {
        this.canvas = canvas
        this.position = new Vec2D.Vector(Math.random() * canvas.width, Math.random() * canvas.height)
        this.velocity = new Vec2D.Vector(-5 + Math.random() * 10, -5 + Math.random() * 10)
        this.cw = canvas.width
        this.ch = canvas.height
        this.space = ''
        this.color = '#0000FF'
    }

    draw(cx) {
        const p1 = new Vec2D.Vector(10, 0), p2 = new Vec2D.Vector(-5, 5), p3 = new Vec2D.Vector(-5, -5)
        const angle = this.velocity.angle()
        p1.rotate(angle).add(this.position)
        p2.rotate(angle).add(this.position)
        p3.rotate(angle).add(this.position)

        cx.beginPath()
        cx.fillStyle = this.color
        cx.moveTo(p1.x, p1.y)
        cx.lineTo(p2.x, p2.y)
        cx.lineTo(p3.x, p3.y)
        cx.fill()
    }
}

class BirdSimulation {

    init(canvas) {
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height

        this.birds = []
        for (let i = 0; i < 2500; i++) {
            const bird = new Bird(canvas)
            bird.index = i
            this.birds.push(bird)
        }

        this.spaces = {}
        
        this.setBirdCount(100)
        this.setApproachDistance(30)
        this.setRepulseDistance(15)

        this.setFlightSpeed(50)
        this.setApproachValue(0.5)
        this.setRepulseValue(3)

        this.setLinearRepulse(true)
        this.setLinearApproach(true)
        this.setRedBird(true)

        this.setCircleAttractMode(true)
        this.setCenterAttractDiameter(400)
        this.setCenterAttractValue(1)

        this.setBoxAttractWidth(800)
        this.setBoxAttractHeight(100)
        this.setBoxAttractValue(1)

        this.setPredator(false)
        this.setPredatorPosition(0, 0)
        this.setPredatorDistance(100)
        this.setPredatorValue(50)
        this.setLinearPredator(true)
        
        this.centerX = canvas.width * 0.5
        this.centerY = canvas.height * 0.5
    }

    clearSpaces() {
        for (let spaceName in this.spaces) {
            if (this.spaces.hasOwnProperty(spaceName)) {
                this.spaces[spaceName].length = 0
            }
        }
    }

    setBirdCount(count) {
        this.birdCount = count
        if (this.birdCount === this.previousBirdCount) {
            return
        }
        if (this.birdCount < this.previousBirdCount) {
            this.clearSpaces()
        }
        this.previousBirdCount = this.birdCount
    }

    setApproachDistance(distance) {
        this.approachDistance = distance
        this.approachSq = this.approachDistance * this.approachDistance
        let biggerDistance = Math.max(this.approachDistance, this.repulseDistance)
        if (this.spaceSize !== biggerDistance) {
            this.spaceSize = biggerDistance
            this.clearSpaces()
        }
    }

    setRepulseDistance(distance) {
        this.repulseDistance = distance
        this.repulseSq = this.repulseDistance * this.repulseDistance
        let biggerDistance = Math.max(this.approachDistance, this.repulseDistance)
        if (this.spaceSize !== biggerDistance) {
            this.spaceSize = biggerDistance
            this.clearSpaces()
        }
    }

    setFlightSpeed(value) {
        this.flightSpeed = value
        this.predatorValue = value
    }

    setApproachValue(value) {
        this.approachValue = value
    }

    setRepulseValue(value) {
        this.repulseValue = value
    }

    setLinearApproach(value) {
        this.linearApproach = value
    }
    
    setLinearRepulse(value) {
        this.linearRepulse = value
    }

    setRedBird(value) {
        this.redBird = value
        this.birds[0].color = this.redBird ? '#FF0000' : '#0000FF'
    }

    setCircleAttractMode(value) {
        this.circleCenterMode = value
    }

    setCenterAttractDiameter(value) {
        this.centerAttractRadius = value * 0.5
        this.centerAttractRadiusSq = this.centerAttractRadius * this.centerAttractRadius
    }

    setCenterAttractValue(value) {
        this.centerAttractValue = value
    }

    setBoxAttractValue(value) {
        this.boxAttractValue = value
    }

    setBoxAttractWidth(value) {
        this.boxAttractHorizontalDist = value * 0.5
    }

    setBoxAttractHeight(value) {
        this.boxAttractVerticalDist = value * 0.5
    }

    setPredatorPosition(x, y) {
        this.predatorPosition = new Vec2D.Vector(x, y)
    }

    setPredator(value) {
        this.predator = value
    }

    setPredatorDistance(value) {
        this.predatorDistanceSq = value * value
    }

    setPredatorValue(value) {
        this.predatorValue = value
    }

    setLinearPredator(value) {
        this.linearPredator = value
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

        const approacLength = this.approachDistance - this.repulseDistance

        const handleOther = (other) => {
            let offset = other.position.clone().subtract(bird.position)
            let distanceSq = offset.x * offset.x + offset.y * offset.y
            let biggerDistanceSq = Math.max(this.approachSq, this.repulseSq)
            if (bird === other
                || distanceSq > biggerDistanceSq) {
                    return
                }
            if (distanceSq < this.repulseSq) {
                if (this.linearRepulse) {
                    const multiplier = (this.repulseDistance - Math.sqrt(distanceSq)) / this.repulseDistance
                    offset.reverse().unit().multiplyByScalar(this.repulseValue * multiplier)
                } else {
                    offset.reverse().unit().multiplyByScalar(this.repulseValue)
                }
            } else {
                if (this.linearApproach) {
                    const multiplier = (approacLength - (Math.sqrt(distanceSq) - this.repulseDistance)) / (this.approachDistance - this.repulseDistance)
                    offset = other.velocity.clone().unit().multiplyByScalar(this.approachValue * multiplier)
                } else {
                    offset = other.velocity.clone().unit().multiplyByScalar(this.approachValue)
                }
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

        if (this.circleCenterMode) {
            const centerOffsetX = this.centerX - bird.position.x
            const centerOffsetY = this.centerY - bird.position.y
            const centerDistanceSq = centerOffsetX * centerOffsetX + centerOffsetY * centerOffsetY

            if (centerDistanceSq > this.centerAttractRadiusSq) {
                bird.velocity.add(new Vec2D.Vector(centerOffsetX, centerOffsetY).unit().multiplyByScalar(this.centerAttractValue))
            }
        } else {
            const horizontalDist = this.centerX - bird.position.x
            const verticalDist = this.centerY - bird.position.y

            if (Math.abs(horizontalDist) > this.boxAttractHorizontalDist) {
                bird.velocity.add(new Vec2D.Vector(Math.sign(horizontalDist), 0).multiplyByScalar(this.boxAttractValue))
            }
            if (Math.abs(verticalDist) > this.boxAttractVerticalDist) {
                bird.velocity.add(new Vec2D.Vector(0, Math.sign(verticalDist)).multiplyByScalar(this.boxAttractValue))
            }
        }

        if (this.predator) {
            const predatorOffsetX = bird.position.x - this.predatorPosition.x
            const predatorOffsetY = bird.position.y - this.predatorPosition.y
            const predatorDistanceSq = predatorOffsetX * predatorOffsetX + predatorOffsetY * predatorOffsetY

            if (predatorDistanceSq < this.predatorDistanceSq) {
                bird.velocity.add(new Vec2D.Vector(predatorOffsetX, predatorOffsetY).unit().multiplyByScalar(this.predatorValue))
            }
        }

        bird.position.add(bird.velocity.multiplyByScalar(dt))
    }

    fixedUpdate(dt) {
        for (let x = this.birdCount - 1; x >= 0; x--) {
            const bird = this.birds[x]
            this.flockBehaviour(bird, dt)
        }
    }

    update(_) {
        
    }

    render(cx) {
        for (let x = this.birdCount - 1; x >= 0; x--) {
            const bird = this.birds[x]
            bird.draw(cx)
        }
    }
}

const birdSim = () => {
    return new BirdSimulation()
}

export default birdSim
