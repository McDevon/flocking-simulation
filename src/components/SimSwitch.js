import React from 'react'
import Switch from 'react-input-switch'

const SimSwitch = ({ label, value, onChange }) => {
    const divStyle = {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5
    }
    const switchStyle = {
        marginRight: 10
    }
    return <div style={divStyle}>
        <Switch style={switchStyle}
            value={value}
            onChange={onChange()}
        />
        {`${label}: ${value ? 'on' : 'off'}`}
    </div>
}

export default SimSwitch