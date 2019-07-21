import React from 'react'
import SimSlider from './SimSlider';

const BoxGravityControls = ({ force, changeForce,
    width, changeWidth,
    height, changeHeight,
    maxWidth, changeMaxWidth,
    maxHeight, changeMaxHeight }) =>
    <div>
        <SimSlider
            label='Min Width' value={width}
            min={0} max={2000} step={10}
            onChange={changeWidth}
        />
        <SimSlider
            label='Min Height' value={height}
            min={0} max={2000} step={10}
            onChange={changeHeight}
        />
        <SimSlider
            label='Max Width' value={maxWidth}
            min={0} max={2000} step={10}
            onChange={changeMaxWidth}
        />
        <SimSlider
            label='Max Height' value={maxHeight}
            min={0} max={2000} step={10}
            onChange={changeMaxHeight}
        />
        <SimSlider
            label='Attract force' value={force.toFixed(1)}
            min={0} max={10} step={0.1}
            onChange={changeForce}
        />
    </div>

export default BoxGravityControls