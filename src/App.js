import React, { useEffect } from 'react'
import Simulation from './components/Simulation'

const App = props => {
  useEffect(() => {
    console.log('app effect')
  })

  return (
    <div>
      <Simulation />
    </div>
  )
}

export default App