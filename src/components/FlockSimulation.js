import React, { useState, useEffect, useRef } from 'react'
import startRender from '../simulations/RenderLoop'
import flockSim from '../simulations/FlockSim'
import Slider from 'react-input-slider'


const FlockSimulation = () => {    
    const [birds, setBirds] = useState({ x: 10 })
    const canvasElement = useRef(null)
    const canvasStyle = {
        border: ' 1px solid #aaa',
    }
    const sliderDivStyle = {
        paddingLeft: '10px',
        paddingRight: '10px'
    }

    const startHook = () => {
        console.log('start hook')
        startRender(canvasElement.current, flockSim())
        canvasElement.current.simulation.setBirdCount(birds.x)
    }

    const changeBirds = () => ({x}) => {
        setBirds({ x: x })
        canvasElement.current.simulation.setBirdCount(x)
    }

    useEffect(startHook, [])

    return <div>
        <canvas style={canvasStyle} ref={canvasElement} width="800" height="450" />
        <div style={sliderDivStyle}>
            <div>
                {`Birds: ${birds.x}`}
            </div>
            <Slider
                axis="x"
                xstep={10}
                xmin={10}
                xmax={2500}
                x={birds.x}
                onChange={changeBirds()}
            />
        </div>
    </div>
}

export default FlockSimulation