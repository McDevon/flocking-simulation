import React, { useEffect } from 'react'
import FlockSimulation from './components/FlockSimulation'

const App = props => {
  const divStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '900px'
}

  useEffect(() => {
    console.log('app effect')
  })

  return (
    <div style={divStyle}>
      <FlockSimulation />
    </div>
  )
}

export default App