import { useState, useEffect } from 'react'
import alarmSound from '../assets/sounds/alarmSound.mp3'
import SubTimer from './SubTimer.js'

const MainTimer = () => {
  const [seconds, setSeconds] = useState(0)

  // Store total seconds for the full timer
  const [totalSeconds, setTotalSeconds] = useState(0)

  const [subTimers, setSubTimers] = useState([])
  const [currentSubTimerIndex, setCurrentSubTimerIndex] = useState(-1)

  const [minutesInput, setMinutesInput] = useState('')
  const [isActive, setIsActive] = useState(false)

  const [subTimerDuration, setSubTimerDuration] = useState('')

  const addSubTimer = () => {
    const duration = parseInt(subTimerDuration)
    if (!isNaN(duration) && duration > 0) {
      setSubTimers([...subTimers, { duration, id: new Date().getTime(), completed: false }])
      setSubTimerDuration('')
    }
  }

  const handleSubTimerEnd = () => {
    const updatedSubTimers = subTimers.map((timer, index) => {
      if (index === currentSubTimerIndex) {
        return { ...timer, completed: true }
      }
      return timer
    })

    const nextIndex = currentSubTimerIndex + 1
    if (nextIndex < subTimers.length) {
      setCurrentSubTimerIndex(nextIndex)
    } else {
      setIsActive(false)  // No more sub-timers, stop the main timer
    }
    setSubTimers(updatedSubTimers)
  }

  const startMainTimer = () => {
    if (subTimers.length > 0 && currentSubTimerIndex === -1) {
      setCurrentSubTimerIndex(0)
      setIsActive(true)
    }
  }

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

  // TODO: Make this circle to its own component
  // Circle SVG Properties
  const size = 200 // Size of the SVG canvas
  const strokeWidth = 10 // Thickness of the circle stroke
  const radius = (size - strokeWidth) / 2 // Radius of the circle
  const circumference = radius * 2 * Math.PI // Circumference of the circle
  const strokeDashoffset =
    ((totalSeconds - seconds) / totalSeconds) * circumference // How much of the circle is unfilled

  return (

    <div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          stroke="blue"
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          // Rotate the circle to start from the top, and rotate it around its center
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

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

      {/* Add sub-timer form */}
      <div>
        <input
          type="number"
          value={subTimerDuration}
          onChange={e => setSubTimerDuration(e.target.value)}
          placeholder="Duration in minutes"
        />
        <button onClick={addSubTimer}>Add Sub-Timer</button>
        <button onClick={startMainTimer} disabled={isActive}>Start Main Timer</button>
      </div>

      {/* Displaying all sub-timers */}
      {subTimers.map((timer, index) => (
        <div key={timer.id}>
          Sub-Timer {index + 1}: {timer.duration} minutes - {timer.completed ? 'Completed' : 'Pending'}
        </div>
      ))}

      {/* Display current sub-timer if active */}
      {isActive && subTimers.length > 0 && currentSubTimerIndex !== -1 && (
        <SubTimer
          key={subTimers[currentSubTimerIndex].id}
          duration={subTimers[currentSubTimerIndex].duration}
          onEnd={handleSubTimerEnd}
        />
      )}
    </div>
  )
}

export default MainTimer
