import * as Vec2D from 'vector2d'
import '../../extensions/VectorExt'

class Bird {

    constructor(canvas) {
        this.canvas = canvas
        this.position = new Vec2D.Vector(Math.random() * canvas.width, Math.random() * canvas.height)
        this.velocity = new Vec2D.Vector(-5 + Math.random() * 10, -5 + Math.random() * 10)
        this.effectMultiplier = 0.1 + Math.random() * 0.9
        this.flockingMultiplier = 0.6 + Math.random() * 0.4
        this.cw = canvas.width
        this.ch = canvas.height
        this.space = ''
        this.color = '#0000FF'
        this.panicTimer = 0
    }

    draw(cx, showPanic = true) {
        const path = [new Vec2D.Vector(10, 0), new Vec2D.Vector(-5, 5), new Vec2D.Vector(-5, -5)]
        const angle = this.velocity.angle()
        const sinAngle = Math.sin(angle)
        const cosAngle = Math.cos(angle)
        for (let i = 0; i < path.length; i++) {
            path[i].rotateTrig(sinAngle, cosAngle).add(this.position)
        }

        cx.beginPath()
        cx.fillStyle = showPanic && this.panicTimer > 0 ? '#FFAA00' : this.color
        cx.moveTo(path[0].x, path[0].y)
        for (let i = 1; i < path.length; i++) {
            cx.lineTo(path[i].x, path[i].y)
        }
        cx.fill()
    }
}

export default Bird