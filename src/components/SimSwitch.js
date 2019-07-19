import React from 'react'
import Switch from 'react-input-switch'

const SimSwitch = ({ label, value, onChange, onLabel = 'On', offLabel = 'Off' }) => {
    const divStyle = {
        marginTop: '5px',
        marginLeft: '5px',
        marginRight: '5px',
        marginBottom: '5px'
    }
    const switchStyle = {
        marginRight: '10px'
    }
    return <div style={divStyle}>
        <Switch style={switchStyle}
            value={value}
            onChange={onChange()}
        />
        {`${label}: ${value ? onLabel : offLabel}`}
    </div>
}

export default SimSwitch