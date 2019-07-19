import React, { useState, useEffect, useRef } from 'react'
import startRender from '../simulations/RenderLoop'
import birdSim from '../simulations/BirdSim'
import SimSlider from './SimSlider';
import SimSwitch from './SimSwitch';

const GravityControls = ({ circleMode, circleValue, changeCircleValue, circleDistance, changeCircleDistance }) => {
    if (circleMode) {
        return <div>
            <SimSlider
                label='Gravity min distance' value={circleDistance}
                min={0} max={1000} step={10}
                onChange={changeCircleDistance}
            />
            <SimSlider
                label='Gravity force' value={circleValue.toFixed(1)}
                min={0} max={10} step={0.1}
                onChange={changeCircleValue}
            />
        </div>
    }

    return <div>
        Box
    </div>
}

const FlockSimulation = () => {
    const [birds, setBirds] = useState({ x: 10 })
    const [flightSpeed, setFlightSpeed] = useState({ x: 50 })
    const [approachDistance, setApproachDistance] = useState({ x: 30 })
    const [repulseDistance, setRepulseDistance] = useState({ x: 15 })
    const [approachValue, setApproachValue] = useState({ x: 0.5 })
    const [repulseValue, setRepulseValue] = useState({ x: 3 })
    const [linearApproach, setLinearApproach] = useState(0)
    const [linearRepulse, setLinearRepulse] = useState(1)
    const [redBird, setRedBird] = useState(1)
    const [circleAttractMode, setCircleAttractMode] = useState(1)
    const [circleGravityDistance, setCircleGravityDistance] = useState({ x: 200 })
    const [circleGravityValue, setCircleGravityValue] = useState({ x: 1 })

    const canvasElement = useRef(null)

    const canvasStyle = {
        border: ' 1px solid #aaa',
    }
    const controlAreaStyle = {
        paddingLeft: '10px',
        paddingRight: '10px'
    }
    const columnStyle = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '200px',
        marginLeft: '5px',
        marginRight: '5px'
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
        canvasElement.current.simulation.setLinearApproach(linearApproach)
        canvasElement.current.simulation.setLinearRepulse(linearRepulse)
        canvasElement.current.simulation.setRedBird(redBird)
        canvasElement.current.simulation.setCenterAttractDist(circleGravityDistance.x)
        //canvasElement.current.simulation.setCenterAttractValue(circleGravityValue.x)
    }

    const changeBirds = () => ({ x }) => {
        setBirds({ x: x })
        canvasElement.current.simulation.setBirdCount(x)
    }

    const changeFlightSpeed = () => ({ x }) => {
        setFlightSpeed({ x: x })
        canvasElement.current.simulation.setFlightSpeed(x)
    }

    const changeApproachValue = () => ({ x }) => {
        setApproachValue({ x: x })
        canvasElement.current.simulation.setApproachValue(x)
    }

    const changeApproachDistance = () => ({ x }) => {
        setApproachDistance({ x: x })
        canvasElement.current.simulation.setApproachDistance(x)
    }

    const changeRepulseValue = () => ({ x }) => {
        setRepulseValue({ x: x })
        canvasElement.current.simulation.setRepulseValue(x)
    }

    const changeRepulseDistance = () => ({ x }) => {
        setRepulseDistance({ x: x })
        canvasElement.current.simulation.setRepulseDistance(x)
    }

    const changeLinearApproach = () => (x) => {
        setLinearApproach(x)
        canvasElement.current.simulation.setLinearApproach(x)
    }

    const changeLinearRepulse = () => (x) => {
        setLinearRepulse(x)
        canvasElement.current.simulation.setLinearRepulse(x)
    }

    const changeRedBird = () => (x) => {
        setRedBird(x)
        canvasElement.current.simulation.setRedBird(x)
    }

    const changeCircleAttractMode = () => (x) => {
        setCircleAttractMode(x)
        canvasElement.current.simulation.setCircleAttractMode(x)
    }

    const changeCircleGravityDistance = () => ({ x }) => {
        setCircleGravityDistance({ x: x })
        //canvasElement.current.simulation.setCenterAttractDist(x)
    }

    const changeCircleGravityValue = () => ({ x }) => {
        setCircleGravityValue({ x: x })
        canvasElement.current.simulation.setCenterAttractValue(x)
    }

    useEffect(startHook, [])

    return <div>
        <canvas style={canvasStyle} ref={canvasElement} width="800" height="450" />
        <div style={controlAreaStyle}>
            <div style={columnStyle}>
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
            </div>
            <div style={columnStyle}>
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
            <div style={columnStyle}>
                <SimSwitch
                    label='Linear approach' value={linearApproach}
                    onChange={changeLinearApproach}
                />
                <SimSwitch
                    label='Linear repulse' value={linearRepulse}
                    onChange={changeLinearRepulse}
                />
                <SimSwitch
                    label='Red bird' value={redBird}
                    onChange={changeRedBird}
                />
            </div>
            <div style={columnStyle}>
                <SimSwitch
                    label='Gravity' value={circleAttractMode}
                    onLabel='Circle' offLabel='Box'
                    onChange={changeCircleAttractMode}
                />
                <GravityControls
                    circleMode={circleAttractMode}
                    
                    circleDistance={circleGravityDistance.x}
                    changeCircleDistance={changeCircleGravityDistance}
                    circleValue={circleGravityValue.x}
                    changeCircleValue={changeCircleGravityValue}
                />
            </div>
        </div>
    </div>
}

export default FlockSimulation