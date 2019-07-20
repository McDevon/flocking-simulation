import React from 'react'
import SimSlider from './SimSlider';

const CircleGravityControls = ({ force, changeForce,
    diameter, changeDiameter }) =>
    <div>
        <SimSlider
            label='Diameter' value={diameter}
            min={0} max={2000} step={10}
            onChange={changeDiameter}
        />
        <SimSlider
            label='Gravity force' value={force.toFixed(1)}
            min={0} max={10} step={0.1}
            onChange={changeForce}
        />
    </div>

export default CircleGravityControls