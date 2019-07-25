import React, { useState, useEffect, useRef } from 'react'
import startRender from '../simulations/RenderLoop'
import birdSim from '../simulations/BirdSim/BirdSim'
import SimSlider from './SimSlider';
import SimSwitch from './SimSwitch';
import CircleGravityControls from './CircleGravityControls'
import BoxGravityControls from './BoxGravityControls'
import FovDisplay from './FovDisplay'

const FlockSimulation = () => {
    const [birds, setBirds] = useState({ x: 1500 })
    const [flightSpeed, setFlightSpeed] = useState({ x: 50 })
    const [maxSpeed, setMaxSpeed] = useState({ x: 120 })
    const [fov, setFov] = useState({ x: 200 })
    const [approachDistance, setApproachDistance] = useState({ x: 60 })
    const [repulseDistance, setRepulseDistance] = useState({ x: 30 })
    const [approachValue, setApproachValue] = useState({ x: 0.5 })
    const [repulseValue, setRepulseValue] = useState({ x: 3 })
    const [linearApproach, setLinearApproach] = useState(0)
    const [linearRepulse, setLinearRepulse] = useState(1)
    const [redBird, setRedBird] = useState(1)
    const [circleAttractMode, setCircleAttractMode] = useState(0)
    const [circleGravityDiameter, setCircleGravityDiameter] = useState({ x: 200 })
    const [circleGravityMaxDiameter, setCircleGravityMaxDiameter] = useState({ x: 400 })
    const [circleGravityValue, setCircleGravityValue] = useState({ x: 1 })
    const [boxWidth, setBoxWidth] = useState({ x: 500 })
    const [boxHeight, setBoxHeight] = useState({ x: 50 })
    const [boxMaxWidth, setBoxMaxWidth] = useState({ x: 700 })
    const [boxMaxHeight, setBoxMaxHeight] = useState({ x: 100 })
    const [boxGravityValue, setBoxGravityValue] = useState({ x: 1 })
    const [triggers, setTriggers] = useState(0)
    const [individualFlocking, setIndividualFlocking] = useState(0)
    const [predator, setPredator] = useState({
        radius1: 110,
        radius2: 150,
        colorPanic: 0,
        panicTime: 4
    })

    const canvasElement = useRef(null)

    const canvasStyle = {
        border: ' 1px solid #aaa',
    }
    const controlAreaStyle = {
        paddingLeft: '25px',
        paddingRight: '25px',
    }
    const columnStyle = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '200px',
        marginLeft: '5px',
        marginRight: '5px'
    }
    const titleStyle = {
        margin: '5px'
    }

    const startHook = () => {
        console.log('start hook')

        startRender(canvasElement.current, birdSim())

        canvasElement.current.simulation.setBirdCount(birds.x)
        canvasElement.current.simulation.setFlightSpeed(flightSpeed.x)
        canvasElement.current.simulation.setMaxSpeed(maxSpeed.x)
        canvasElement.current.simulation.setFov(fov.x)
        canvasElement.current.simulation.setApproachDistance(approachDistance.x)
        canvasElement.current.simulation.setRepulseDistance(repulseDistance.x)
        canvasElement.current.simulation.setApproachValue(approachValue.x)
        canvasElement.current.simulation.setRepulseValue(repulseValue.x)
        canvasElement.current.simulation.setLinearApproach(linearApproach)
        canvasElement.current.simulation.setLinearRepulse(linearRepulse)
        canvasElement.current.simulation.setRedBird(redBird)
        canvasElement.current.simulation.setCircleAttractMode(circleAttractMode)
        canvasElement.current.simulation.setCenterAttractDiameter(circleGravityDiameter.x)
        canvasElement.current.simulation.setCenterAttractFarthestDiameter(circleGravityMaxDiameter.x)
        canvasElement.current.simulation.setCenterAttractValue(circleGravityValue.x)
        canvasElement.current.simulation.setBoxAttractWidth(boxWidth.x)
        canvasElement.current.simulation.setBoxAttractHeight(boxHeight.x)
        canvasElement.current.simulation.setBoxAttractFarthestWidth(boxMaxWidth.x)
        canvasElement.current.simulation.setBoxAttractFarthestHeight(boxMaxHeight.x)
        canvasElement.current.simulation.setBoxAttractValue(boxGravityValue.x)
        canvasElement.current.simulation.setTriggerVisualizations(triggers)
        canvasElement.current.simulation.setIndividualFlocking(individualFlocking)
        canvasElement.current.simulation.setPredatorSetup(predator.radius1, predator.radius2, predator.colorPanic, predator.panicTime)

        window.addEventListener("mousedown", (event) => {
            event.preventDefault()
            const rect = canvasElement.current.getBoundingClientRect()
            if (event.clientX < rect.left || event.clientY < rect.top
                || event.clientX > rect.right || event.clientY > rect.bottom) {
                return
            }
            canvasElement.current.simulation.setPredator(true)
        })

        window.addEventListener("mouseup", (event) => {
            const rect = canvasElement.current.getBoundingClientRect()
            if (event.clientX < rect.left || event.clientY < rect.top
                || event.clientX > rect.right || event.clientY > rect.bottom) {
                return
            }
            canvasElement.current.simulation.setPredator(false)
        })

        window.addEventListener("mousemove", (event) => {
            const rect = canvasElement.current.getBoundingClientRect()
            if (event.clientX < rect.left || event.clientY < rect.top
                || event.clientX > rect.right || event.clientY > rect.bottom) {
                canvasElement.current.simulation.setPredator(false)
                return
            }
            const x = (event.clientX - rect.left) / (rect.right - rect.left) * canvasElement.current.width
            const y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvasElement.current.height
            canvasElement.current.simulation.setPredatorPosition(x, y)
        })

        return () => {
            window.removeEventListener("mousemove")
            window.removeEventListener("mouseup")
            window.removeEventListener("mousedown")
        }
    }

    const changeBirds = () => ({ x }) => {
        setBirds({ x: x })
        canvasElement.current.simulation.setBirdCount(x)
    }

    const changeFlightSpeed = () => ({ x }) => {
        if (x > maxSpeed.x) {
            setMaxSpeed({ x: x })
            canvasElement.current.simulation.setMaxSpeed(x)
        }
        setFlightSpeed({ x: x })
        canvasElement.current.simulation.setFlightSpeed(x)
    }

    const changeMaxSpeed = () => ({ x }) => {
        if (x < flightSpeed.x) {
            setFlightSpeed({ x: x })
            canvasElement.current.simulation.setFlightSpeed(x)
        }
        setMaxSpeed({ x: x })
        canvasElement.current.simulation.setMaxSpeed(x)
    }

    const changeFov = () => ({ x }) => {
        setFov({ x: x })
        canvasElement.current.simulation.setFov(x)
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

    const changeCircleGravityDiameter = () => ({ x }) => {
        if (x > circleGravityMaxDiameter.x) {
            setCircleGravityMaxDiameter({ x: x })
            canvasElement.current.simulation.setCenterAttractFarthestDiameter(x)
        }
        setCircleGravityDiameter({ x: x })
        canvasElement.current.simulation.setCenterAttractDiameter(x)
    }

    const changeCircleGravityMaxDiameter = () => ({ x }) => {
        if (x < circleGravityDiameter.x) {
            setCircleGravityDiameter({ x: x })
            canvasElement.current.simulation.setCenterAttractDiameter(x)
        }
        setCircleGravityMaxDiameter({ x: x })
        canvasElement.current.simulation.setCenterAttractFarthestDiameter(x)
    }

    const changeCircleGravityValue = () => ({ x }) => {
        setCircleGravityValue({ x: x })
        canvasElement.current.simulation.setCenterAttractValue(x)
    }

    const changeBoxGravityValue = () => ({ x }) => {
        setBoxGravityValue({ x: x })
        canvasElement.current.simulation.setBoxAttractValue(x)
    }

    const changeGravityBoxWidth = () => ({ x }) => {
        if (x > boxMaxWidth.x) {
            setBoxMaxWidth({ x: x })
            canvasElement.current.simulation.setBoxAttractFarthestWidth(x)
        }
        setBoxWidth({ x: x })
        canvasElement.current.simulation.setBoxAttractWidth(x)
    }

    const changeGravityBoxHeight = () => ({ x }) => {
        if (x > boxMaxHeight.x) {
            setBoxMaxHeight({ x: x })
            canvasElement.current.simulation.setBoxAttractFarthestHeight(x)
        }
        setBoxHeight({ x: x })
        canvasElement.current.simulation.setBoxAttractHeight(x)
    }

    const changeGravityBoxMaxWidth = () => ({ x }) => {
        if (x < boxWidth.x) {
            setBoxWidth({ x: x })
            canvasElement.current.simulation.setBoxAttractWidth(x)
        }
        setBoxMaxWidth({ x: x })
        canvasElement.current.simulation.setBoxAttractFarthestWidth(x)
    }

    const changeGravityBoxMaxHeight = () => ({ x }) => {
        if (x < boxHeight.x) {
            setBoxHeight({ x: x })
            canvasElement.current.simulation.setBoxAttractHeight(x)
        }
        setBoxMaxHeight({ x: x })
        canvasElement.current.simulation.setBoxAttractFarthestHeight(x)
    }

    const changeTriggers = () => (x) => {
        setTriggers(x)
        canvasElement.current.simulation.setTriggerVisualizations(x)
    }

    const changeIndividualFlocking = () => (x) => {
        setIndividualFlocking(x)
        canvasElement.current.simulation.setIndividualFlocking(x)
    }
    
    const changePredator = ({ radius1, radius2, colorPanic, panicTime }) => {
        const newRadius1 = radius1 > radius2 && radius1 === predator.radius1 ? radius2 : radius1
        const newRadius2 = radius1 > radius2 && radius2 === predator.radius2 ? radius1 : radius2
        setPredator({
            radius1: newRadius1,
            radius2: newRadius2,
            colorPanic: colorPanic,
            panicTime: panicTime })
        canvasElement.current.simulation.setPredatorSetup(newRadius1, newRadius2, colorPanic, panicTime)
    }

    useEffect(startHook, [])

    return <div>
        <canvas style={canvasStyle} ref={canvasElement} width="900" height="600" />
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
                    label='Max speed' value={maxSpeed.x}
                    min={0} max={200} step={1}
                    onChange={changeMaxSpeed}
                />
                <SimSlider
                    label='FOV' value={fov.x} suffix="°"
                    min={0} max={360} step={1}
                    onChange={changeFov}
                />
            </div>
            <div style={columnStyle}>
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
            <div style={columnStyle}>
                <FovDisplay 
                    fov={fov.x}
                    approachDistance={approachDistance.x}
                    repulseDistance={repulseDistance.x}
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
                    label='Flocking variance' value={individualFlocking}
                    onChange={changeIndividualFlocking}
                />
                <SimSwitch
                    label='Red bird' value={redBird}
                    onChange={changeRedBird}
                />
                <SimSwitch
                    label='Show triggers' value={triggers}
                    onChange={changeTriggers}
                />
            </div>
            <div style={columnStyle}>
                <SimSwitch
                    label='Attract mode' value={circleAttractMode}
                    onLabel='Circle' offLabel='Box'
                    onChange={changeCircleAttractMode}
                />
                {circleAttractMode ?
                    <CircleGravityControls diameter={circleGravityDiameter.x}
                        changeDiameter={changeCircleGravityDiameter}
                        maxDiameter={circleGravityMaxDiameter.x}
                        changeMaxDiameter={changeCircleGravityMaxDiameter}
                        force={circleGravityValue.x}
                        changeForce={changeCircleGravityValue} /> :
                    <BoxGravityControls force={boxGravityValue.x}
                        changeForce={changeBoxGravityValue}
                        width={boxWidth.x}
                        changeWidth={changeGravityBoxWidth}
                        height={boxHeight.x}
                        changeHeight={changeGravityBoxHeight}
                        maxWidth={boxMaxWidth.x}
                        changeMaxWidth={changeGravityBoxMaxWidth}
                        maxHeight={boxMaxHeight.x}
                        changeMaxHeight={changeGravityBoxMaxHeight} />}
            </div>
            <div style={columnStyle}>
                <div style={titleStyle}>
                    Predator
                </div>
                <SimSlider
                    label='Min Radius' value={predator.radius1}
                    min={0} max={500} step={5}
                    onChange={() => ({x}) => { changePredator({...predator, radius1: x}) }}
                />
                <SimSlider
                    label='Max Radius' value={predator.radius2}
                    min={0} max={500} step={5}
                    onChange={() => ({x}) => { changePredator({...predator, radius2: x}) }}
                />
                <SimSlider
                    label='Panic Time' value={predator.panicTime.toFixed(1)}
                    min={0} max={20} step={0.1}
                    onChange={() => ({x}) => { changePredator({...predator, panicTime: x}) }}
                />
                <SimSwitch
                    label='Color panic' value={predator.colorPanic}
                    onChange={() => (x) => { changePredator({...predator, colorPanic: x}) }}
                />
            </div>
        </div>
    </div>
}

export default FlockSimulation