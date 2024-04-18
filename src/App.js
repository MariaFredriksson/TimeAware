import { useState } from 'react'
import './App.css'
import MainTimer from './components/MainTimer'

function App() {
  const [timers, setTimers] = useState([])

  const addTimer = () => {
    setTimers(timers => [...timers, <MainTimer key={timers.length} />])
  }

  return (
    <div className="App">
      {/* Always show the first timer */}
      <MainTimer />

      {/* Then show additional timers, if there are any */}
      {timers.map((timer, index) => (
        <div key={index}>
          {timer}
        </div>
      ))}
      <br />
      <button onClick={addTimer}>Add Timer</button>
    </div>
  )
}

export default App
