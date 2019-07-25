import React, { useState, useEffect, useRef } from 'react'
import startRender from '../simulations/RenderLoop'
import birdSim from '../simulations/BirdSim/BirdSim'
import SimSlider from './SimSlider';
import SimSwitch from './SimSwitch';
import CircleGravityControls from './CircleGravityControls'
import BoxGravityControls from './BoxGravityControls'
import FovDisplay from './FovDisplay'

const FlockSimulation = () => {
    const [birdSetup, setBirdSetup] = useState({
        count: 1500,
        speed: 50,
        maxSpeed: 120,
        fov: 200,
        repulseDistance: 30,
        approachDistance: 60,
        repulseValue: 3,
        approachValue: 0.5,
        linearRepulse: 1,
        linearApproach: 0,
        individualFlocking: 0
    })
    const [attractSetup, setAttractSetup] = useState({
        circleMode: 0,
        circleDiameter1: 200,
        circleDiameter2: 400,
        circleValue: 1,
        boxWidth1: 500,
        boxWidth2: 700,
        boxHeight1: 50,
        boxHeight2: 100,
        boxValue: 1
    })
    const [predator, setPredator] = useState({
        radius1: 110,
        radius2: 150,
        colorPanic: 0,
        panicTime: 4
    })
    const [triggers, setTriggers] = useState(0)
    const [redBird, setRedBird] = useState(1)

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

        canvasElement.current.simulation.setupBirds(birdSetup)
        canvasElement.current.simulation.setupAttraction(attractSetup)
        canvasElement.current.simulation.setRedBird(redBird)
        canvasElement.current.simulation.setTriggerVisualizations(triggers)
        canvasElement.current.simulation.setupPredator(predator)

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

    const changeBirdSetup = ({ count, speed, maxSpeed, fov, repulseDistance,
        approachDistance, repulseValue, approachValue, linearRepulse, linearApproach,
        individualFlocking }) => {

        const newSpeed = speed > maxSpeed && speed === birdSetup.speed ? maxSpeed : speed
        const newMaxSpeed = speed > maxSpeed && maxSpeed === birdSetup.maxSpeed ? speed : maxSpeed

        const newSetup = {
            count: count,
            speed: newSpeed,
            maxSpeed: newMaxSpeed,
            fov: fov,
            repulseDistance: repulseDistance,
            approachDistance: approachDistance,
            repulseValue: repulseValue,
            approachValue: approachValue,
            linearRepulse: linearRepulse,
            linearApproach: linearApproach,
            individualFlocking: individualFlocking
        }
        setBirdSetup(newSetup)
        canvasElement.current.simulation.setupBirds(newSetup)
    }

    const changeAttractSetup = ({ circleMode, circleDiameter1, circleDiameter2,
        circleValue, boxWidth1, boxWidth2, boxHeight1, boxHeight2, boxValue
    }) => {

        const newDiameter1 = circleDiameter1 > circleDiameter2 && attractSetup.circleDiameter1 === circleDiameter1 ? circleDiameter2 : circleDiameter1
        const newDiameter2 = circleDiameter1 > circleDiameter2 && attractSetup.circleDiameter2 === circleDiameter2 ? circleDiameter1 : circleDiameter2
        const newWidth1 = boxWidth1 > boxWidth2 && attractSetup.boxWidth1 === boxWidth1 ? boxWidth2 : boxWidth1
        const newWidth2 = boxWidth1 > boxWidth2 && attractSetup.boxWidth2 === boxWidth2 ? boxWidth1 : boxWidth2
        const newHeight1 = boxHeight1 > boxHeight2 && attractSetup.boxHeight1 === boxHeight1 ? boxHeight2 : boxHeight1
        const newHeight2 = boxHeight1 > boxHeight2 && attractSetup.boxHeight2 === boxHeight2 ? boxHeight1 : boxHeight2

        const newSetup = {
            circleMode: circleMode,
            circleDiameter1: newDiameter1,
            circleDiameter2: newDiameter2,
            circleValue: circleValue,
            boxWidth1: newWidth1,
            boxWidth2: newWidth2,
            boxHeight1: newHeight1,
            boxHeight2: newHeight2,
            boxValue: boxValue
        }
        setAttractSetup(newSetup)
        canvasElement.current.simulation.setupAttraction(newSetup)
    }

    const changeRedBird = () => (x) => {
        setRedBird(x)
        canvasElement.current.simulation.setRedBird(x)
    }

    const changeTriggers = () => (x) => {
        setTriggers(x)
        canvasElement.current.simulation.setTriggerVisualizations(x)
    }

    const changePredator = ({ radius1, radius2, colorPanic, panicTime }) => {
        const newRadius1 = radius1 > radius2 && radius1 === predator.radius1 ? radius2 : radius1
        const newRadius2 = radius1 > radius2 && radius2 === predator.radius2 ? radius1 : radius2
        const newSetup = {
            radius1: newRadius1,
            radius2: newRadius2,
            colorPanic: colorPanic,
            panicTime: panicTime
        }
        setPredator(newSetup)
        canvasElement.current.simulation.setupPredator(newSetup)
    }

    useEffect(startHook, [])

    return <div>
        <canvas style={canvasStyle} ref={canvasElement} width="900" height="600" />
        <div style={controlAreaStyle}>
            <div style={columnStyle}>
                <SimSlider
                    label='Birds' value={birdSetup.count}
                    min={10} max={2500} step={10}
                    onChange={() => ({ x }) => { changeBirdSetup({ ...birdSetup, count: x }) }}
                />
                <SimSlider
                    label='Bird speed' value={birdSetup.speed}
                    min={0} max={200} step={1}
                    onChange={() => ({ x }) => { changeBirdSetup({ ...birdSetup, speed: x }) }}
                />
                <SimSlider
                    label='Max speed' value={birdSetup.maxSpeed}
                    min={0} max={200} step={1}
                    onChange={() => ({ x }) => { changeBirdSetup({ ...birdSetup, maxSpeed: x }) }}
                />
                <SimSlider
                    label='FOV' value={birdSetup.fov} suffix="°"
                    min={0} max={360} step={1}
                    onChange={() => ({ x }) => { changeBirdSetup({ ...birdSetup, fov: x }) }}
                />
            </div>
            <div style={columnStyle}>
                <SimSlider
                    label='Approach distance' value={birdSetup.approachDistance}
                    min={0} max={200} step={1}
                    onChange={() => ({ x }) => { changeBirdSetup({ ...birdSetup, approachDistance: x }) }}
                />
                <SimSlider
                    label='Approach value' value={birdSetup.approachValue.toFixed(1)}
                    min={0} max={10} step={0.1}
                    onChange={() => ({ x }) => { changeBirdSetup({ ...birdSetup, approachValue: x }) }}
                />
                <SimSlider
                    label='Repulse distance' value={birdSetup.repulseDistance}
                    min={0} max={200} step={1}
                    onChange={() => ({ x }) => { changeBirdSetup({ ...birdSetup, repulseDistance: x }) }}
                />
                <SimSlider
                    label='Repulse value' value={birdSetup.repulseValue.toFixed(1)}
                    min={0} max={10} step={0.1}
                    onChange={() => ({ x }) => { changeBirdSetup({ ...birdSetup, repulseValue: x }) }}
                />
            </div>
            <div style={columnStyle}>
                <FovDisplay
                    fov={birdSetup.fov}
                    approachDistance={birdSetup.approachDistance}
                    repulseDistance={birdSetup.repulseDistance}
                />
            </div>
            <div style={columnStyle}>
                <SimSwitch
                    label='Linear approach' value={birdSetup.linearApproach}
                    onChange={() => (x) => { changeBirdSetup({ ...birdSetup, linearApproach: x }) }}
                />
                <SimSwitch
                    label='Linear repulse' value={birdSetup.linearRepulse}
                    onChange={() => (x) => { changeBirdSetup({ ...birdSetup, linearRepulse: x }) }}
                />
                <SimSwitch
                    label='Flocking variance' value={birdSetup.individualFlocking}
                    onChange={() => (x) => { changeBirdSetup({ ...birdSetup, individualFlocking: x }) }}
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
                    label='Attract mode' value={attractSetup.circleMode}
                    onLabel='Circle' offLabel='Box'
                    onChange={() => (x) => { changeAttractSetup({ ...attractSetup, circleMode: x }) }}
                />
                {attractSetup.circleMode ?
                    <CircleGravityControls diameter={attractSetup.circleDiameter1}
                        changeDiameter={() => ({ x }) => { changeAttractSetup({ ...attractSetup, circleDiameter1: x }) }}
                        maxDiameter={attractSetup.circleDiameter2}
                        changeMaxDiameter={() => ({ x }) => { changeAttractSetup({ ...attractSetup, circleDiameter2: x }) }}
                        force={attractSetup.circleValue}
                        changeForce={() => ({ x }) => { changeAttractSetup({ ...attractSetup, circleValue: x }) }} /> :
                    <BoxGravityControls force={attractSetup.boxValue}
                        changeForce={() => ({ x }) => { changeAttractSetup({ ...attractSetup, boxValue: x }) }}
                        width={attractSetup.boxWidth1}
                        changeWidth={() => ({ x }) => { changeAttractSetup({ ...attractSetup, boxWidth1: x }) }}
                        height={attractSetup.boxHeight1}
                        changeHeight={() => ({ x }) => { changeAttractSetup({ ...attractSetup, boxHeight1: x }) }}
                        maxWidth={attractSetup.boxWidth2}
                        changeMaxWidth={() => ({ x }) => { changeAttractSetup({ ...attractSetup, boxWidth2: x }) }}
                        maxHeight={attractSetup.boxHeight2}
                        changeMaxHeight={() => ({ x }) => { changeAttractSetup({ ...attractSetup, boxHeight2: x }) }} />}
            </div>
            <div style={columnStyle}>
                <div style={titleStyle}>
                    Predator
                </div>
                <SimSlider
                    label='Min Radius' value={predator.radius1}
                    min={0} max={500} step={5}
                    onChange={() => ({ x }) => { changePredator({ ...predator, radius1: x }) }}
                />
                <SimSlider
                    label='Max Radius' value={predator.radius2}
                    min={0} max={500} step={5}
                    onChange={() => ({ x }) => { changePredator({ ...predator, radius2: x }) }}
                />
                <SimSlider
                    label='Panic Time' value={predator.panicTime.toFixed(1)}
                    min={0} max={20} step={0.1}
                    onChange={() => ({ x }) => { changePredator({ ...predator, panicTime: x }) }}
                />
                <SimSwitch
                    label='Color panic' value={predator.colorPanic}
                    onChange={() => (x) => { changePredator({ ...predator, colorPanic: x }) }}
                />
            </div>
        </div>
    </div>
}

export default FlockSimulation