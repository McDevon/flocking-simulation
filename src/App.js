import React, { useEffect } from 'react'
import FlockSimulation from './components/FlockSimulation'
import Footer from './components/Footer'

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
      <Footer />
    </div>
  )
}

export default App