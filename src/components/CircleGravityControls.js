import React from 'react'
import SimSlider from './SimSlider';

const CircleGravityControls = ({ force, changeForce,
    diameter, changeDiameter,
    maxDiameter, changeMaxDiameter }) =>
    <div>
        <SimSlider
            label='Min Diameter' value={diameter}
            min={0} max={2000} step={10}
            onChange={changeDiameter}
        />
        <SimSlider
            label='Max Diameter' value={maxDiameter}
            min={0} max={2000} step={10}
            onChange={changeMaxDiameter}
        />
        <SimSlider
            label='Attract force' value={force.toFixed(1)}
            min={0} max={10} step={0.1}
            onChange={changeForce}
        />
    </div>

export default CircleGravityControls