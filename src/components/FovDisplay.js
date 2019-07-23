import React, { useEffect, useRef } from 'react'
import * as Vec2D from 'vector2d'
import '../extensions/VectorExt'

const FovDisplay = ({ fov, approachDistance, repulseDistance }) => {
    const canvasElement = useRef(null)
    const canvasStyle = {
        border: ' 1px solid #aaa',
    }
    const divStyle = {
        margin: '5px'
    }

    let context = null

    const renderHook = () => {
        const canvas = canvasElement.current
        if (context === null) {
            context = canvas.getContext('2d')
        }
        context.clearRect(0, 0, canvas.width, canvas.height)

        const centerX = canvas.width * 0.5
        const centerY = canvas.height * 0.5
        const birdAngle = Math.PI * -0.5
        const fovRad = fov / 180 * Math.PI
        context.fillStyle = '#88CC8888'
        context.beginPath()
        context.moveTo(centerX, centerY)
        context.arc(centerX, centerY, approachDistance, birdAngle - fovRad / 2, birdAngle + fovRad / 2)
        context.fill()
        context.fillStyle = '#CC888888'
        context.beginPath()
        context.moveTo(centerX, centerY)
        context.arc(centerX, centerY, repulseDistance, birdAngle - fovRad / 2, birdAngle + fovRad / 2)
        context.fill()

        const path = [new Vec2D.Vector(10, 0), new Vec2D.Vector(-5, 5), new Vec2D.Vector(-5, -5)]
        const sinAngle = Math.sin(birdAngle)
        const cosAngle = Math.cos(birdAngle)
        for (let i = 0; i < path.length; i++) {
            path[i].rotateTrig(sinAngle, cosAngle).add(new Vec2D.Vector(centerX, centerY))
        }

        context.beginPath()
        context.fillStyle = '#FF0000'
        context.moveTo(path[0].x, path[0].y)
        for (let i = 1; i < path.length; i++) {
            context.lineTo(path[i].x, path[i].y)
        }
        context.fill()
    }

    useEffect(renderHook)

    return <div style={divStyle}>
        <canvas style={canvasStyle} ref={canvasElement} width="200" height="200" />
    </div>
}

export default FovDisplay