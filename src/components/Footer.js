import React, { useEffect, useRef } from 'react'

const Footer = () => {

    const style = {
        textAlign: 'right'
    }

    return <div style={style}>
        <p>Copyright (c) Jussi Enroos 2019<br />
        <a href='https://github.com/McDevon/simple-simulation-platform'>Source</a> with MIT licence</p>
    </div>
}

export default Footer