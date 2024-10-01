import { useState, useEffect } from 'react'
import './App.css'
import MainTimer from './components/MainTimer'
import Navbar from './components/Navbar'
import NotificationList from './components/NotificationList'
import { playAlarm, stopAlarm } from './services/audioService.js'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [timers, setTimers] = useState([])
  const [notifications, setNotifications] = useState([])

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
    // Play the alarm and get the audio instance
    const alarmAudio = playAlarm() 
    
    const newNotification = {
      id: uuidv4(),
      name: name,
      alarmAudio: alarmAudio // Store the audio instance with the notification
    }

    setNotifications((prevNotifications) => [...prevNotifications, newNotification])
  }

  const stopTimerNotification = (id) => {
    setNotifications((prevNotifications) => {
      const notificationToRemove = prevNotifications.find((notification) => notification.id === id)
      if (notificationToRemove && notificationToRemove.alarmAudio) {
        stopAlarm(notificationToRemove.alarmAudio)
      }
      return prevNotifications.filter((notification) => notification.id !== id)
    })
  }

  return (
    <div className="App color-1">
      <Navbar />

      <div className='app-area'>

        {/* Show the NotificationList if there are any notifications */}
        {notifications.length > 0 && (
          <NotificationList
            notifications={notifications}
            onClose={stopTimerNotification}
          />
        )}

        {/* Hide the timers and the add timer button if any notifications are shown */}
        <div className={`timers-container ${notifications.length > 0 ? 'hidden' : ''}`}>
          {timers.map(timer => (
            <div key={timer.id} className='border rounded-4 p-3 mx-2 mt-4'>
              <MainTimer
                name={timer.name}
                onTimerComplete={() => handleTimerComplete(timer.name)}
                updateName={(newName) => updateTimerName(timer.id, newName)}
              />
              <button onClick={() => deleteTimer(timer.id)} className='color-4 color-2-text btn m-3'>Delete</button>
            </div>
          ))}
        </div>

        {<button onClick={addTimer} className={`color-4 color-2-text btn my-5 ${notifications.length > 0 ? 'hidden' : ''}`}>Add Timer</button>}
      </div>
    </div>
  )
}

export default App
