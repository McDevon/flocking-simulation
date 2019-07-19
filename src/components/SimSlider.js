import React from 'react'
import Slider from 'react-input-slider'

const SimSlider = ({ label, value, step, min, max, onChange }) => {
    const divStyle = {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5
    }
    return <div style={divStyle}>
        <div>
            {`${label}: ${value}`}
        </div>
        <Slider
            axis="x"
            xstep={step}
            xmin={min}
            xmax={max}
            x={value}
            onChange={onChange()}
        />
    </div>
}

export default SimSlider