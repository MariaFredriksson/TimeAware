import { useState, useEffect } from 'react'
import alarmSound from '../assets/sounds/alarmSound.mp3'
import CountdownCircle from './CountdownCircle.js'

const MainTimer = ({ name }) => {
  const [seconds, setSeconds] = useState(0)

  // Store total seconds for the full timer
  const [totalSeconds, setTotalSeconds] = useState(0)

  const [minutesInput, setMinutesInput] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [isActive, setIsActive] = useState(false)

  const [timerName, setTimerName] = useState(name)

  useEffect(() => {
    // Create a variable to store the interval ID, which will be used to clear the interval later
    // and hence stop the timer
    let intervalID = null

    if (isActive && seconds > 0) {
      intervalID = setInterval(() => {
        setSeconds((seconds) => seconds - 1)
      }, 1000)
    } else if (isActive && seconds <= 0) {
      // Stop the interval when the timer reaches 0 and also set the isActive state to false
      clearInterval(intervalID) 
      setIsActive(false)
      playAlarm()
    }

    // Clean-up function that first cleans up the previous effect before applying the next effect
    // and also prevents eventual side effects when the component is unmounted from the DOM
    return () => clearInterval(intervalID)

    // When the isActive or seconds state changes, the useEffect function will run again
  }, [isActive, seconds])

  // TODO: Make the alarm loop until the user stops it
  const playAlarm = () => {
    const alarm = new Audio(alarmSound)
    alarm.play()
  }

  // TODO: Maybe do something else instead of the pause button
  const toggle = () => {
    if (!isActive && (minutesInput || timeInput)) {
      if (timeInput) {
        setTimerToSpecificTime()
      } else {
        // Convert and set the timer only if it's not already active and there's input
        const inputSeconds = parseInt(minutesInput, 10) * 60
        setSeconds(inputSeconds)
  
        // Set total seconds for calculating the circle progress
        setTotalSeconds(inputSeconds)
      }
      setIsActive(true)
    } else if (isActive) {
      setIsActive(false)
    }
  }

  const setTimerToSpecificTime = () => {
    const targetTime = new Date()
    const [hours, minutes] = timeInput.split(':').map(Number)
    targetTime.setHours(hours, minutes, 0)
    
    const currentTime = new Date()
    let difference = (targetTime - currentTime) / 1000 // difference in seconds

    if (difference < 0) {
      // If the target time is in the past, set it for the next day
      difference += 86400 // Add 24 hours worth of seconds
    }

    setSeconds(difference)
    setTotalSeconds(difference)
  }

  const reset = () => {
    setSeconds(0)
    setTotalSeconds(0)
    setMinutesInput('')
    setTimeInput('')
    setIsActive(false)
  }

  const handleChange = (e) => {
    // Allow change only if timer is not active
    if (!isActive) {
      if (e.target.name === 'minutesInput') {
        setMinutesInput(e.target.value)
      } else if (e.target.name === 'timeInput') {
        setTimeInput(e.target.value)
      }
    }
  }

  const handleSubmit = (e) => {
    // Prevent the default form submission behavior, like refreshing the page
    e.preventDefault()

    toggle()
  }

  const handleNameChange = (e) => {
    setTimerName(e.target.value);
  }

  // Calculate minutes and seconds for display
  const displayMinutes = Math.floor(seconds / 60)
  const displaySeconds = seconds % 60

  return (
    <div>
      {/* Only show the countdown circle when the timer is active */}
      {isActive && <CountdownCircle size={200} strokeWidth={10} seconds={seconds} totalSeconds={totalSeconds} />}

      {/* Display both minutes and seconds */}
      {/* Use padStart to ensure that seconds are always displayed with two digits, prefixing a '0' when necessary */}
      <h2>{`${displayMinutes}m : ${displaySeconds.toString().padStart(2, '0')}s`}</h2>

      {/* //^^ Can't change name by pressing enter, but is it important? */}
      <input type="text" value={timerName} onChange={handleNameChange} placeholder="Timer Name" />

      {/* If the user presses Enter, the form will submit and the timer will start */}
      <form onSubmit={handleSubmit}>

        <input
          type="number"
          name="minutesInput"
          value={minutesInput}
          onChange={handleChange}
          placeholder="Minutes"
          // Disable input when timer is active
          disabled={isActive}
        />

        {/* //^^ Can't add timer by pressing enter, but is that important? */}
        <input
          type="time"
          name="timeInput"
          value={timeInput}
          onChange={handleChange}
          placeholder="HH:MM"
          disabled={isActive}
        />

        {/* //TODO: Make the buttons to components */}
        <button type='button' onClick={toggle}>{isActive ? 'Pause' : 'Start'}</button>
        <button type='button' onClick={reset}>Reset</button>

      </form>
    </div>
  )
}

export default MainTimer
