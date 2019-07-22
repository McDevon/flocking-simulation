import React from 'react'
import Slider from 'react-input-slider'

const SimSlider = ({ label, value, step, min, max, onChange, suffix='' }) => {
    const divStyle = {
        marginTop: '5px',
        marginLeft: '5px',
        marginRight: '5px',
        marginBottom: '5px'
    }
    return <div style={divStyle}>
        <div>
            {`${label}: ${value}${suffix}`}
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