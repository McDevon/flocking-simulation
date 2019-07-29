import React from 'react'
import LabelSlider from './LabelSlider';

const CircleGravityControls = ({ force, changeForce,
    diameter, changeDiameter,
    maxDiameter, changeMaxDiameter }) =>
    <div>
        <LabelSlider
            label='Min Diameter' value={diameter}
            min={0} max={2000} step={10}
            onChange={changeDiameter}
        />
        <LabelSlider
            label='Max Diameter' value={maxDiameter}
            min={0} max={2000} step={10}
            onChange={changeMaxDiameter}
        />
        <LabelSlider
            label='Attract force' value={force.toFixed(1)}
            min={0} max={10} step={0.1}
            onChange={changeForce}
        />
    </div>

export default CircleGravityControls