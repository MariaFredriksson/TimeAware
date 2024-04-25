import { useState, useEffect } from 'react'
import './App.css'
import MainTimer from './components/MainTimer'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [timers, setTimers] = useState([])

  // Initialize with the first timer when the component mounts, so there is always at least one timer
  useEffect(() => {
    addInitialTimer()
  }, [])

  const addInitialTimer = () => {
    const initialTimer = {
      id: uuidv4(),
      name: 'Timer 1'
    }
    setTimers([initialTimer])
  }

  const addTimer = () => {
    const newTimer = {
      id: uuidv4(),
      name: `Timer ${timers.length + 1}`
    }
    setTimers([...timers, newTimer])
  }

  const deleteTimer = (id) => {
    setTimers(timers.filter(timer => timer.id !== id))
  }

  return (
    <div className="App color-1">
      {timers.map(timer => (
        <div key={timer.id}>
          <MainTimer name={timer.name} />
          <button onClick={() => deleteTimer(timer.id)} className='color-4 color-2-text btn m-3'>Delete</button>
        </div>
      ))}
      <button onClick={addTimer} className='color-4 color-2-text btn m-3'>Add Timer</button>
    </div>
  )
}

export default App
