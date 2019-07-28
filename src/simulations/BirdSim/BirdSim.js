import * as Vec2D from 'vector2d'
import '../../extensions/CanvasExt'
import Bird from './Bird'
import SpatialHash from '../SpatialHash'

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

        this.spaces = new SpatialHash(10)

        this.setupBirds({
            count: 100, speed: 50, maxSpeed: 100, fov: 270,
            repulseDistance: 15, approachDistance: 30, repulseValue: 3,
            approachValue: 0.5, linearRepulse: false, linearApproach: false,
            individualFlocking: false
        })

        this.setupAttraction({
            circleMode: true, circleDiameter1: 200, circleDiameter2: 400, circleValue: 1,
            boxWidth1: 500, boxWidth2: 700, boxHeight1: 50, boxHeight2: 100, boxValue: 1
        })

        this.setRedBird(true)

        this.setupPredator({
            radius1: 30, radius2: 150, colorPanic: false, panicTime: 4
        })
        this.setPredator(false)
        this.setPredatorPosition(0, 0)
        this.setLinearPredator(true)
        this.setPanicReduction(0.2)
        this.setPanicAmplification(10)

        this.setTriggerVisualizations(false)

        this.centerX = canvas.width * 0.5
        this.centerY = canvas.height * 0.5
    }

    setupBirds({ count, speed, maxSpeed, fov, repulseDistance, approachDistance,
        repulseValue, approachValue, linearRepulse, linearApproach, individualFlocking }) {

        this.setBirdCount(count)
        this.setFlightSpeed(speed)
        this.setMaxSpeed(maxSpeed)
        this.setFov(fov)
        this.setRepulseDistance(repulseDistance)
        this.setApproachDistance(approachDistance)
        this.setRepulseValue(repulseValue)
        this.setApproachValue(approachValue)
        this.setLinearRepulse(linearRepulse)
        this.setLinearApproach(linearApproach)
        this.setIndividualFlocking(individualFlocking)
    }

    setBirdCount(count) {
        this.birdCount = count
        if (this.birdCount === this.previousBirdCount) {
            return
        }
        if (this.birdCount < this.previousBirdCount) {
            this.spaces.clear()
        }
        this.previousBirdCount = this.birdCount
    }

    setApproachDistance(distance) {
        this.approachDistance = distance
        this.approachSq = this.approachDistance * this.approachDistance
        let biggerDistance = Math.max(this.approachDistance, this.repulseDistance)
        if (this.spaceSize !== biggerDistance) {
            this.spaces.resize(biggerDistance)
        }
    }

    setRepulseDistance(distance) {
        this.repulseDistance = distance
        this.repulseSq = this.repulseDistance * this.repulseDistance
        let biggerDistance = Math.max(this.approachDistance, this.repulseDistance)
        if (this.spaceSize !== biggerDistance) {
            this.spaces.resize(biggerDistance)
        }
    }

    setFlightSpeed(value) {
        this.flightSpeed = value
        this.predatorValue = value * 2.5
    }

    setMaxSpeed(value) {
        this.maxSpeed = value
        this.maxSpeedSq = this.maxSpeed * this.maxSpeed
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

    setFov(value) {
        this.fov = value
        const radians = value * Math.PI / 180
        if (this.fov === 180) {
            this.fovTestAngle = 0
        } else {
            this.fovTestAngle = (radians - Math.PI) / 2
        }
        this.fovTestSin = Math.sin(this.fovTestAngle)
        this.fovTestCos = Math.cos(this.fovTestAngle)
    }

    setupAttraction({ circleMode, circleDiameter1, circleDiameter2,
        circleValue, boxWidth1, boxWidth2, boxHeight1, boxHeight2, boxValue }) {
        this.setCircleAttractMode(circleMode)
        this.setCenterAttractDiameter(circleDiameter1)
        this.setCenterAttractFarthestDiameter(circleDiameter2)
        this.setCenterAttractValue(circleValue)
        this.setBoxAttractWidth(boxWidth1)
        this.setBoxAttractFarthestWidth(boxWidth2)
        this.setBoxAttractHeight(boxHeight1)
        this.setBoxAttractFarthestHeight(boxHeight2)
        this.setBoxAttractValue(boxValue)
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

    setupPredator({ radius1, radius2, colorPanic, panicTime }) {
        this.predatorFullEffectRadius = radius1
        this.predatorFullEffectRadiusSq = radius1 * radius1

        this.predatorMaxRadius = radius2
        this.predatorMaxRadiusSq = radius2 * radius2

        this.panicTime = panicTime
        this.panicSlowdownTime = panicTime * 0.25
        this.colorPanic = colorPanic
    }

    setPredatorValue(value) {
        this.predatorValue = value
    }

    setLinearPredator(value) {
        this.linearPredator = value
    }

    setPanicReduction(value) {
        this.panicReduction = value
    }

    setPanicAmplification(value) {
        this.panicAmplification = value
    }

    setRedBird(value) {
        this.redBird = value
        this.birds[0].color = this.redBird ? '#FF0000' : '#0000FF'
    }

    setTriggerVisualizations(value) {
        this.triggerVisualizations = value
    }

    setIndividualFlocking(value) {
        this.individualFlocking = value
    }

    flockBehaviour(bird, dt) {
        let speed = this.flightSpeed
        if (bird.panicTimer > 0) {
            if (bird.panicTimer > this.panicSlowdownTime) {
                speed *= 1.5
            } else {
                speed *= 1 + 0.5 * (bird.panicTimer / this.panicSlowdownTime)
            }
            bird.panicTimer -= dt
        }

        bird.velocity.unit().multiplyByScalar(speed)

        this.spaces.registerPosition(bird, bird.position)

        const approacLength = this.approachDistance - this.repulseDistance

        const handleOther = (other) => {
            let offset = other.position.clone().subtract(bird.position)
            const distanceSq = offset.lengthSq()
            const biggerDistanceSq = Math.max(this.approachSq, this.repulseSq)
            const flockingMultiplier = this.individualFlocking ? bird.flockingMultiplier : 1
            if (bird === other
                || distanceSq > biggerDistanceSq) {
                return
            }
            if (this.fov < 360) {
                if (this.fov === 180 && bird.velocity.dot(offset) < 0) {
                    return
                } else if (this.fov !== 180) {
                    const t1 = offset.clone().rotateTrig(this.fovTestSin, this.fovTestCos)
                    const t2 = offset.clone().rotateTrig(-this.fovTestSin, this.fovTestCos)
                    if ((this.fov < 180 && (bird.velocity.dot(t1) < 0 || bird.velocity.dot(t2) < 0))
                        || (this.fov > 180 && bird.velocity.dot(t1) < 0 && bird.velocity.dot(t2) < 0)) {
                        return
                    }
                }
            }
            if (other.panicTimer > bird.panicTimer + this.panicTime * 0.5) {
                bird.panicTimer = other.panicTimer - this.panicReduction
            }
            const panicAmplifier = other.panicTimer > 0 && other.panicTimer > bird.panicTimer ? this.panicAmplification : bird.panicTimer > 0 ? 0.1 : 1
            if (distanceSq < this.repulseSq && other.panicTimer <= 0) {
                if (this.linearRepulse) {
                    const multiplier = (this.repulseDistance - Math.sqrt(distanceSq)) / this.repulseDistance
                    offset.reverse().unit().multiplyByScalar(this.repulseValue * multiplier * flockingMultiplier)
                } else {
                    offset.reverse().unit().multiplyByScalar(this.repulseValue * flockingMultiplier)
                }
            } else {
                if (this.linearApproach) {
                    const multiplier = (approacLength - (Math.sqrt(distanceSq) - this.repulseDistance)) / (this.approachDistance - this.repulseDistance)
                    offset = other.velocity.clone().unit().multiplyByScalar(this.approachValue * multiplier * flockingMultiplier * panicAmplifier)
                } else {
                    offset = other.velocity.clone().unit().multiplyByScalar(this.approachValue * flockingMultiplier * panicAmplifier)
                }
            }
            bird.velocity.add(offset)
        }

        if (this.fov > 0) {
            this.spaces.itemsFromAdjacentSpaces(bird.position).forEach(handleOther)
        }

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
                bird.panicTimer = this.panicTime
            }
        }

        bird.velocity.clampSq(this.maxSpeed, this.maxSpeedSq)
        bird.position.add(bird.velocity.multiplyByScalar(dt))
    }

    fixedUpdate(dt) {
        for (let i = 0; i < this.birdCount; i++) {
            const bird = this.birds[i]
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
        cx.arc(this.centerX, this.centerY, this.centerAttractFarthestRadius, 0, Math.PI * 2)
        cx.fill()
        cx.beginPath()
        cx.fillStyle = '#FFFFFF'
        cx.arc(this.centerX, this.centerY, this.centerAttractRadius, 0, Math.PI * 2)
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
        cx.arc(this.predatorPosition.x, this.predatorPosition.y, this.predatorMaxRadius, 0, Math.PI * 2)
        cx.fill()
        cx.fillStyle = '#DD8888AA'
        cx.beginPath()
        cx.arc(this.predatorPosition.x, this.predatorPosition.y, this.predatorFullEffectRadius, 0, Math.PI * 2)
        cx.fill()
    }

    renderBirdTriggers(cx, bird) {
        const velAngle = bird.velocity.angle()
        const fov = this.fov / 180 * Math.PI
        if (this.repulseDistance < this.approachDistance) {
            cx.fillStyle = '#88CC8888'
            cx.beginPath()
            cx.moveTo(bird.position.x, bird.position.y)
            cx.arc(bird.position.x, bird.position.y, this.approachDistance, velAngle - fov / 2, velAngle + fov / 2)
            cx.fill()
        }
        cx.fillStyle = '#CC888888'
        cx.beginPath()
        cx.moveTo(bird.position.x, bird.position.y)
        cx.arc(bird.position.x, bird.position.y, this.repulseDistance, velAngle - fov / 2, velAngle + fov / 2)
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

        if (this.triggerVisualizations && this.redBird) {
            this.renderBirdTriggers(cx, this.birds[0])
        }

        for (let i = this.birdCount - 1; i >= 0; i--) {
            const bird = this.birds[i]
            bird.draw(cx, this.colorPanic)
        }
    }
}

const birdSim = () => {
    return new BirdSimulation()
}

export default birdSim
