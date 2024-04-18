import { useState, useEffect } from 'react'
import alarmSound from '../assets/sounds/alarmSound.mp3'
import CountdownCircle from './CountdownCircle.js'

const MainTimer = () => {
  const [seconds, setSeconds] = useState(0)

  // Store total seconds for the full timer
  const [totalSeconds, setTotalSeconds] = useState(0)

  const [minutesInput, setMinutesInput] = useState('')
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Create a variable to store the interval ID, which will be used to clear the interval later
    // and hence stop the timer
    let intervalID = null

    if (isActive && seconds > 0) {
      intervalID = setInterval(() => {
        setSeconds((seconds) => seconds - 1)
      }, 1000)
    } else if (seconds <= 0) {
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
    if (!isActive && minutesInput) {
      // Convert and set the timer only if it's not already active and there's input
      const inputSeconds = parseInt(minutesInput, 10) * 60
      setSeconds(inputSeconds)

      // Set total seconds for calculating the circle progress
      setTotalSeconds(inputSeconds)
    }
    setIsActive(!isActive)
  }

  const reset = () => {
    setSeconds(0)
    setTotalSeconds(0)
    setMinutesInput('')
    setIsActive(false)
  }

  const handleChange = (e) => {
    // Allow change only if timer is not active
    if (!isActive) {
      setMinutesInput(e.target.value)
    }
  }

  const handleSubmit = (e) => {
    // Prevent the default form submission behavior, like refreshing the page
    e.preventDefault()

    toggle()
  }

  // Calculate minutes and seconds for display
  const displayMinutes = Math.floor(seconds / 60)
  const displaySeconds = seconds % 60

  return (
    <div>
      <CountdownCircle size={200} strokeWidth={10} seconds={seconds} totalSeconds={totalSeconds} />

      {/* Display both minutes and seconds */}
      {/* Use padStart to ensure that seconds are always displayed with two digits, prefixing a '0' when necessary */}
      <h2>{`${displayMinutes}m : ${displaySeconds.toString().padStart(2, '0')}s`}</h2>

      {/* If the user presses Enter, the form will submit and the timer will start */}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={minutesInput}
          onChange={handleChange}
          placeholder="Minutes"
          // Disable input when timer is active
          disabled={isActive}
        />

        {/* //TODO: Make the buttons to components */}
        <button type='button' onClick={toggle}>{isActive ? 'Pause' : 'Start'}</button>
        <button type='button' onClick={reset}>Reset</button>

      </form>
      <p>Test tag</p>
    </div>
  )
}

export default MainTimer
