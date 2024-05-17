import { useState, useEffect } from 'react'
import './App.css'
import MainTimer from './components/MainTimer'
import Navbar from './components/Navbar'
import { playAlarm, stopAlarm } from './services/audioService.js'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [timers, setTimers] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [finishedTimerName, setFinishedTimerName] = useState('')

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

  const updateTimerName = (id, newName) => {
    setTimers(timers.map(timer => {
      if (timer.id === id) {
        return { ...timer, name: newName }
      }
      return timer
    }))
  }

  const handleTimerComplete = (name) => {
    setFinishedTimerName(name)
    setShowNotification(true)
    playAlarm()
  }

  const stopTimerNotification = () => {
    setShowNotification(false)
    stopAlarm()
  }

  return (
    <div className="App color-1">
      <Navbar />

      <div className='app-area'>

        {/* // TODO: Make into a component */}
        {showNotification && (
          <div className="notification-bar border rounded-4 p-3 mx-2 mt-4">
            <p className='color-3-text fw-bold mx-4 my-3'>{`Timer "${finishedTimerName}" is done!`}</p>
            <button onClick={stopTimerNotification} className="color-2 btn my-2">Stop Timer</button>
          </div>
        )}

        {!showNotification && timers.map(timer => (
          <div key={timer.id} className='border rounded-4 p-3 mx-2 mt-4'>
            <MainTimer 
              name={timer.name} 
              onTimerComplete={() => handleTimerComplete(timer.name)}
              updateName={(newName) => updateTimerName(timer.id, newName)}
            />
            <button onClick={() => deleteTimer(timer.id)} className='color-4 color-2-text btn m-3'>Delete</button>
          </div>
        ))}

        {!showNotification && <button onClick={addTimer} className='color-4 color-2-text btn my-5'>Add Timer</button>}
      </div>
    </div>
  )
}

export default App
