import React from 'react'
import LabelSlider from './LabelSlider';

const BoxGravityControls = ({ force, changeForce,
    width, changeWidth,
    height, changeHeight,
    maxWidth, changeMaxWidth,
    maxHeight, changeMaxHeight }) =>
    <div>
        <LabelSlider
            label='Min Width' value={width}
            min={0} max={2000} step={10}
            onChange={changeWidth}
        />
        <LabelSlider
            label='Min Height' value={height}
            min={0} max={2000} step={10}
            onChange={changeHeight}
        />
        <LabelSlider
            label='Max Width' value={maxWidth}
            min={0} max={2000} step={10}
            onChange={changeMaxWidth}
        />
        <LabelSlider
            label='Max Height' value={maxHeight}
            min={0} max={2000} step={10}
            onChange={changeMaxHeight}
        />
        <LabelSlider
            label='Attract force' value={force.toFixed(1)}
            min={0} max={10} step={0.1}
            onChange={changeForce}
        />
    </div>

export default BoxGravityControls