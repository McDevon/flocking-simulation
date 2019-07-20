import React from 'react'
import SimSlider from './SimSlider';

const BoxGravityControls = ({ force, changeForce,
    width, changeWidth,
    height, changeHeight }) =>
    <div>
        <SimSlider
            label='Width' value={width}
            min={0} max={2000} step={10}
            onChange={changeWidth}
        />
        <SimSlider
            label='Height' value={height}
            min={0} max={2000} step={10}
            onChange={changeHeight}
        />
        <SimSlider
            label='Gravity force' value={force.toFixed(1)}
            min={0} max={10} step={0.1}
            onChange={changeForce}
        />
    </div>

export default BoxGravityControls