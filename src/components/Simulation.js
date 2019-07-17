import React, { useState, useEffect, useRef } from 'react'
import startRender from '../simulations/RenderLoop'
import testSim from '../simulations/TestSim'

const Simulation = () => {
    const [counter, setCounter] = useState(10)
    const canvasElement = useRef(null)
    const canvasStyle = {
        border: ' 1px solid #aaa',
    }

    const decrease = () => () => {
        const newValue = Math.max(counter - 1, 0)
        setCounter(newValue)
        canvasElement.current['counter'] = newValue
    }
    const increase = () => () => {
        const newValue = Math.min(counter + 1, 20)
        setCounter(newValue)
        canvasElement.current['counter'] = newValue
    }

    const startHook = () => {
        console.log('start hook')
        canvasElement.current['counter'] = 10
        startRender(canvasElement.current, testSim())
    }

    useEffect(startHook, [])

    return <div>
        <canvas style={canvasStyle} ref={canvasElement} width="400" height="300" />
        <div>
            {counter}
            <button onClick={increase()}>
                +
            </button>
            <button onClick={decrease()}>
                -
            </button>
        </div>
    </div>
}

export default Simulation