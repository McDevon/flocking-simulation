import React, { useState, useEffect, useRef } from 'react'
import startRender from '../simulations/RenderLoop'
import birdSim from '../simulations/BirdSim'
import Slider from 'react-input-slider'


const FlockSimulation = () => {    
    const [birds, setBirds] = useState({ x: 10 })
    const [flightSpeed, setFlightSpeed] = useState({ x: 50 })
    const [approachDistance, setApproachDistance] = useState({ x: 30 })
    const [repulseDistance, setRepulseDistance] = useState({ x: 15 })
    const [approachValue, setApproachValue] = useState({ x: 0.5 })
    const [repulseValue, setRepulseValue] = useState({ x: 3 })
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
        startRender(canvasElement.current, birdSim())
        canvasElement.current.simulation.setBirdCount(birds.x)
        canvasElement.current.simulation.setFlightSpeed(flightSpeed.x)
        canvasElement.current.simulation.setApproachDistance(approachDistance.x)
        canvasElement.current.simulation.setRepulseDistance(repulseDistance.x)
        canvasElement.current.simulation.setApproachValue(approachValue.x)
        canvasElement.current.simulation.setRepulseValue(repulseValue.x)
    }

    const changeBirds = () => ({x}) => {
        setBirds({ x: x })
        canvasElement.current.simulation.setBirdCount(x)
    }

    const changeFlightSpeed = () => ({x}) => {
        setFlightSpeed({ x: x })
        canvasElement.current.simulation.setFlightSpeed(x)
    }

    const changeApproachValue = () => ({x}) => {
        setApproachValue({ x: x })
        canvasElement.current.simulation.setApproachValue(x)
    }

    const changeApproachDistance = () => ({x}) => {
        setApproachDistance({ x: x })
        canvasElement.current.simulation.setApproachDistance(x)
    }

    const changeRepulseValue = () => ({x}) => {
        setRepulseValue({ x: x })
        canvasElement.current.simulation.setRepulseValue(x)
    }

    const changeRepulseDistance = () => ({x}) => {
        setRepulseDistance({ x: x })
        canvasElement.current.simulation.setRepulseDistance(x)
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
            <div>
                {`Bird speed: ${flightSpeed.x}`}
            </div>
            <Slider
                axis="x"
                xstep={1}
                xmin={0}
                xmax={200}
                x={flightSpeed.x}
                onChange={changeFlightSpeed()}
            />
            <div>
                {`Approach distance: ${approachDistance.x}`}
            </div>
            <Slider
                axis="x"
                xstep={1}
                xmin={0}
                xmax={200}
                x={approachDistance.x}
                onChange={changeApproachDistance()}
            />
            <div>
                {`Approach value: ${approachValue.x.toFixed(1)}`}
            </div>
            <Slider
                axis="x"
                xstep={0.1}
                xmin={0}
                xmax={10}
                x={approachValue.x}
                onChange={changeApproachValue()}
            />
            <div>
                {`Repulse distance: ${repulseDistance.x}`}
            </div>
            <Slider
                axis="x"
                xstep={1}
                xmin={0}
                xmax={200}
                x={repulseDistance.x}
                onChange={changeRepulseDistance()}
            />
            <div>
                {`Repulse value: ${repulseValue.x.toFixed(1)}`}
            </div>
            <Slider
                axis="x"
                xstep={0.1}
                xmin={0}
                xmax={10}
                x={repulseValue.x}
                onChange={changeRepulseValue()}
            />
        </div>
    </div>
}

export default FlockSimulation