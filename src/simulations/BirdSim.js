import * as Vec2D from 'vector2d'

Vec2D.Vector.prototype.rotate = function (angle) {
    const x = this._x, y = this._y
    this._x = x * Math.cos(angle) - y * Math.sin(angle)
    this._y = x * Math.sin(angle) + y * Math.cos(angle)
    return this
}

Vec2D.Vector.prototype.angle = function () {
    return Math.atan2(this._y, this._x)
}

CanvasRenderingContext2D.prototype.line = function (x1, y1, x2, y2) {
    this.beginPath()
    this.moveTo(x1, y1)
    this.lineTo(x2, y2)
    this.stroke()
}

class Bird {

    constructor(canvas) {
        this.canvas = canvas
        this.position = new Vec2D.Vector(Math.random() * canvas.width, Math.random() * canvas.height)
        this.velocity = new Vec2D.Vector(-5 + Math.random() * 10, -5 + Math.random() * 10)
        this.effectMultiplier = 0.1 + Math.random() * 0.9
        this.flockingMultiplier = 0.5 + Math.random() * 0.5
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

        this.setIndividualFlocking(false)

        this.setLinearRepulse(true)
        this.setLinearApproach(true)
        this.setRedBird(true)

        this.setCircleAttractMode(true)
        this.setCenterAttractDiameter(300)
        this.setCenterAttractFarthestDiameter(800)
        this.setCenterAttractValue(1)

        this.setBoxAttractWidth(600)
        this.setBoxAttractFarthestWidth(400)
        this.setBoxAttractHeight(50)
        this.setBoxAttractFarthestHeight(100)
        this.setBoxAttractValue(1)

        this.setPredator(false)
        this.setPredatorPosition(0, 0)
        this.setPredatorFullEffectRadius(30)
        this.setPredatorMaxRadius(150)
        this.setLinearPredator(true)

        this.setTriggerVisualizations(false)

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
        this.predatorValue = value * 1.5
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

    setCenterAttractFarthestDiameter(value) {
        this.centerAttractFarthestRadius = value * 0.5
        this.centerAttractFarthestRadiusSq = this.centerAttractFarthestRadius * this.centerAttractFarthestRadius
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

    setBoxAttractFarthestWidth(value) {
        this.boxAttractFarthestHorizontalDist = value * 0.5
    }

    setBoxAttractHeight(value) {
        this.boxAttractVerticalDist = value * 0.5
    }

    setBoxAttractFarthestHeight(value) {
        this.boxAttractFarthestVerticalDist = value * 0.5
    }

    setPredatorPosition(x, y) {
        this.predatorPosition = new Vec2D.Vector(x, y)
    }

    setPredator(value) {
        this.predator = value
    }

    setPredatorMaxRadius(value) {
        this.predatorMaxRadius = value
        this.predatorMaxRadiusSq = value * value
    }

    setPredatorFullEffectRadius(value) {
        this.predatorFullEffectRadius = value
        this.predatorFullEffectRadiusSq = value * value
    }

    setPredatorValue(value) {
        this.predatorValue = value
    }

    setLinearPredator(value) {
        this.linearPredator = value
    }

    setTriggerVisualizations(value) {
        this.triggerVisualizations = value
    }

    setIndividualFlocking(value) {
        this.individualFlocking = value
    }

    flockBehaviour(bird, dt) {
        bird.velocity.unit().multiplyByScalar(this.flightSpeed)

        const spaceX = Math.floor(bird.position.x / this.spaceSize)
        const spaceY = Math.floor(bird.position.y / this.spaceSize)
        const spaceName = `${spaceX},${spaceY}`

        if (bird.space !== spaceName) {
            if (this.spaces.hasOwnProperty(bird.space)) {
                const space = this.spaces[bird.space]
                for (var i = 0; i < space.length; i++) {
                    if (space[i] === bird) {
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
            const distanceSq = offset.x * offset.x + offset.y * offset.y
            const biggerDistanceSq = Math.max(this.approachSq, this.repulseSq)
            const flockingMultiplier = this.individualFlocking ? bird.flockingMultiplier : 1
            if (bird === other
                || distanceSq > biggerDistanceSq) {
                return
            }
            if (distanceSq < this.repulseSq) {
                if (this.linearRepulse) {
                    const multiplier = (this.repulseDistance - Math.sqrt(distanceSq)) / this.repulseDistance
                    offset.reverse().unit().multiplyByScalar(this.repulseValue * multiplier * flockingMultiplier)
                } else {
                    offset.reverse().unit().multiplyByScalar(this.repulseValue * flockingMultiplier)
                }
            } else {
                if (this.linearApproach) {
                    const multiplier = (approacLength - (Math.sqrt(distanceSq) - this.repulseDistance)) / (this.approachDistance - this.repulseDistance)
                    offset = other.velocity.clone().unit().multiplyByScalar(this.approachValue * multiplier * flockingMultiplier)
                } else {
                    offset = other.velocity.clone().unit().multiplyByScalar(this.approachValue * flockingMultiplier)
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
                if (centerDistanceSq < this.centerAttractFarthestRadiusSq) {
                    const multiplier = (Math.sqrt(centerDistanceSq) - this.centerAttractRadius) / (this.centerAttractFarthestRadius - this.centerAttractRadius)
                    bird.velocity.add(new Vec2D.Vector(centerOffsetX, centerOffsetY).unit().multiplyByScalar(this.centerAttractValue * multiplier * bird.effectMultiplier))
                } else {
                    bird.velocity.add(new Vec2D.Vector(centerOffsetX, centerOffsetY).unit().multiplyByScalar(this.centerAttractValue * bird.effectMultiplier))               
                }
            }
        } else {
            const horizontalDist = this.centerX - bird.position.x
            const verticalDist = this.centerY - bird.position.y
            const absH = Math.abs(horizontalDist)
            const absV = Math.abs(verticalDist)

            if (absH > this.boxAttractHorizontalDist) {
                if (absH < this.boxAttractFarthestHorizontalDist) {
                    const multiplier = (absH - this.boxAttractHorizontalDist) / (this.boxAttractFarthestHorizontalDist - this.boxAttractHorizontalDist)
                    bird.velocity.add(new Vec2D.Vector(Math.sign(horizontalDist), 0).multiplyByScalar(this.boxAttractValue * multiplier * bird.effectMultiplier))
                } else {
                    bird.velocity.add(new Vec2D.Vector(Math.sign(horizontalDist), 0).multiplyByScalar(this.boxAttractValue * bird.effectMultiplier))
                }
            }
            if (absV > this.boxAttractVerticalDist) {
                if (absV < this.boxAttractFarthestVerticalDist) {
                    const multiplier = (absV - this.boxAttractVerticalDist) / (this.boxAttractFarthestVerticalDist - this.boxAttractVerticalDist)
                    bird.velocity.add(new Vec2D.Vector(0, Math.sign(verticalDist)).multiplyByScalar(this.boxAttractValue * multiplier * bird.effectMultiplier))
                } else {
                    bird.velocity.add(new Vec2D.Vector(0, Math.sign(verticalDist)).multiplyByScalar(this.boxAttractValue * bird.effectMultiplier))
                }
            }
        }

        if (this.predator) {
            const predatorOffsetX = bird.position.x - this.predatorPosition.x
            const predatorOffsetY = bird.position.y - this.predatorPosition.y
            const predatorDistanceSq = predatorOffsetX * predatorOffsetX + predatorOffsetY * predatorOffsetY

            if (predatorDistanceSq < this.predatorMaxRadiusSq) {
                if (predatorDistanceSq < this.predatorFullEffectRadiusSq) {
                    bird.velocity.add(new Vec2D.Vector(predatorOffsetX, predatorOffsetY).unit().multiplyByScalar(this.predatorValue * bird.effectMultiplier))
                } else {
                    const multiplier = 1 - (Math.sqrt(predatorDistanceSq) - this.predatorFullEffectRadius) / (this.predatorMaxRadius - this.predatorFullEffectRadius)
                    bird.velocity.add(new Vec2D.Vector(predatorOffsetX, predatorOffsetY).unit().multiplyByScalar(this.predatorValue * multiplier * bird.effectMultiplier))
                }
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

    renderCircleAttractMode(cx) {
        cx.fillStyle = '#DDDDDD'
        cx.fillRect(0, 0, this.width, this.height)
        cx.beginPath()
        cx.fillStyle = '#EEEEEE'
        cx.arc(this.centerX, this.centerY, this.centerAttractFarthestRadius, 0, Math.PI * 360)
        cx.fill()
        cx.beginPath()
        cx.fillStyle = '#FFFFFF'
        cx.arc(this.centerX, this.centerY, this.centerAttractRadius, 0, Math.PI * 360)
        cx.fill()
    }

    renderBoxAttractMode(cx) {
        cx.fillStyle = '#DDDDDD'
        cx.fillRect(0, 0, this.width, this.height)
        cx.fillStyle = '#EEEEEE'
        const maxHorz = Math.max(this.boxAttractFarthestHorizontalDist, this.boxAttractHorizontalDist)
        const maxVert = Math.max(this.boxAttractFarthestVerticalDist, this.boxAttractVerticalDist)
        cx.fillRect(this.centerX - maxHorz, this.centerY - maxVert, maxHorz * 2, maxVert * 2)
        cx.fillStyle = '#FFFFFF'
        cx.fillRect(this.centerX - this.boxAttractHorizontalDist, this.centerY - this.boxAttractVerticalDist, this.boxAttractHorizontalDist * 2, this.boxAttractVerticalDist * 2)
        cx.lineWidth = 0.2
        cx.line(this.centerX - maxHorz, 0, this.centerX - maxHorz, this.height)
        cx.line(this.centerX + maxHorz, 0, this.centerX + maxHorz, this.height)
        cx.line(0, this.centerY - maxVert, this.width, this.centerY - maxVert)
        cx.line(0, this.centerY + maxVert, this.width, this.centerY + maxVert)
        cx.line(this.centerX - this.boxAttractHorizontalDist, 0, this.centerX - this.boxAttractHorizontalDist, this.height)
        cx.line(this.centerX + this.boxAttractHorizontalDist, 0, this.centerX + this.boxAttractHorizontalDist, this.height)
        cx.line(0, this.centerY - this.boxAttractVerticalDist, this.width, this.centerY - this.boxAttractVerticalDist)
        cx.line(0, this.centerY + this.boxAttractVerticalDist, this.width, this.centerY + this.boxAttractVerticalDist)
    }

    renderPredator(cx) {
        cx.fillStyle = '#D5AAAAAA'
        cx.beginPath()
        cx.arc(this.predatorPosition.x, this.predatorPosition.y, this.predatorMaxRadius, 0, Math.PI * 360)
        cx.fill()
        cx.fillStyle = '#DD8888AA'
        cx.beginPath()
        cx.arc(this.predatorPosition.x, this.predatorPosition.y, this.predatorFullEffectRadius, 0, Math.PI * 360)
        cx.fill()
    }

    render(cx) {
        cx.clearRect(0, 0, this.width, this.height)

        if (this.triggerVisualizations) {
            if (this.circleCenterMode) {
                this.renderCircleAttractMode(cx)
            } else {
                this.renderBoxAttractMode(cx)   
            }
            if (this.predator) {
                this.renderPredator(cx)
            }
        }

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
