import React, { useState, useEffect, useRef } from 'react'
import startRender from '../simulations/RenderLoop'
import birdSim from '../simulations/BirdSim'
import SimSlider from './SimSlider';

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
            <SimSlider
                label='Birds' value={birds.x}
                min={10} max={2500} step={10}
                onChange={changeBirds}
                />
            <SimSlider
                label='Bird speed' value={flightSpeed.x}
                min={0} max={200} step={1}
                onChange={changeFlightSpeed}
                />
            <SimSlider
                label='Approach distance' value={approachDistance.x}
                min={0} max={200} step={1}
                onChange={changeApproachDistance}
                />
            <SimSlider
                label='Approach value' value={approachValue.x.toFixed(1)}
                min={0} max={10} step={0.1}
                onChange={changeApproachValue}
                />
            <SimSlider
                label='Repulse distance' value={repulseDistance.x}
                min={0} max={200} step={1}
                onChange={changeRepulseDistance}
                />
            <SimSlider
                label='Repulse value' value={repulseValue.x.toFixed(1)}
                min={0} max={10} step={0.1}
                onChange={changeRepulseValue}
                />
        </div>
    </div>
}

export default FlockSimulation