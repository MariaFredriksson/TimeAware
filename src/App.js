import { useState } from 'react'
import './App.css'
import MainTimer from './components/MainTimer'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [timers, setTimers] = useState([])

  const addTimer = () => {
    const newTimer = {
      id: uuidv4(),
      // Timer name is +2 because the first timer is always shown, and it is not in the array
      name: `Timer ${timers.length + 2}`
    };
    setTimers([...timers, newTimer])
  }

  const deleteTimer = (id) => {
    setTimers(timers.filter(timer => timer.id !== id))
  }

  return (
    <div className="App">
      {/* // TODO: Make it possible to delete this timer also */}
      {/* Always show the first timer */}
      <MainTimer name='Timer 1'/>

      {/* Then show additional timers, if there are any */}
      {timers.map(timer => (
        <div key={timer.id}>
          <MainTimer name={timer.name} />
          <button onClick={() => deleteTimer(timer.id)}>Delete</button>
        </div>
      ))}
      <br />
      <button onClick={addTimer}>Add Timer</button>
    </div>
  )
}

export default App
