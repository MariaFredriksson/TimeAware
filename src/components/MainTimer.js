import { useState, useEffect } from 'react'
import CountdownCircle from './CountdownCircle.js'

const MainTimer = ({ name, onTimerComplete  }) => {
  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [minutesInput, setMinutesInput] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [timerName, setTimerName] = useState(name)
  const [error, setError] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [isMinutesChanged, setIsMinutesChanged] = useState(false)

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
      onTimerComplete()
    }

    // Clean-up function that first cleans up the previous effect before applying the next effect
    // and also prevents eventual side effects when the component is unmounted from the DOM
    return () => clearInterval(intervalID)

    // When the isActive or seconds state changes, the useEffect function will run again
  }, [isActive, onTimerComplete, seconds])

  const validateTimeInput = (time) => {
    const parts = time.split(':')
    if (parts.length === 2) {
      const hours = parseInt(parts[0], 10)
      const minutes = parseInt(parts[1], 10)
  
      if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
        setError('Hours must be between 00 and 23.')
        return false
      } else if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
        setError('Minutes must be between 00 and 59.')
        return false
      } else {
        setError('')
        return true
      }
    } else {
      setError('Time must be in HH:MM format.')
      return false
    }
  }

  const validateMinutes = (minutes) => {
    // 10 is the radix, which specifies the base of the number system (decimal)
    const minutesNum = parseInt(minutes, 10)

    // Check if the input is an integer and is between 1 and 1440 minutes (24 hours)
    if (!Number.isInteger(minutesNum)) {
      setError('Please enter a whole number of minutes.')
      return false
    }
    else if (minutesNum < 1 || minutesNum > 1440) {
      setError('Please enter a value between 1 minute and 1440 minutes (24 hours).')
      return false
    } else {
      setError('')
      return true
    }
  }

  // TODO: Maybe do something else instead of the pause button
  const toggle = () => {
    // When the timer is started
    if (!isActive && (minutesInput || timeInput)) {
      if (timeInput && validateTimeInput(timeInput)) {
        setTimerToSpecificTime()
      } else if (minutesInput && validateMinutes(minutesInput)) {
        // If the timer has been stared before and is just paused now, and the input hasn't changed, just start it again
        if (isStarted && !isMinutesChanged) {
          setIsActive(true)
        } else {
          setTimerToMinutes()
        }
      }

    // When the timer is paused
    } else if (isActive) {
      setIsActive(false)
      setIsMinutesChanged(false)
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

    // Ensure the seconds and totalSeconds are whole numbers
    setSeconds(Math.floor(difference))
    setTotalSeconds(Math.floor(difference))
    setIsActive(true)
    setIsStarted(true)
  }

  const setTimerToMinutes = () => {
    const inputSeconds = parseInt(minutesInput, 10) * 60
    setSeconds(inputSeconds)

    // Set total seconds for calculating the circle progress
    setTotalSeconds(inputSeconds)
    setIsActive(true)
    setIsStarted(true)
  }

  const reset = () => {
    setSeconds(0)
    setTotalSeconds(0)
    setMinutesInput('')
    setTimeInput('')
    setIsActive(false)
    setIsStarted(false)
  }

  const handleChange = (e) => {
    // Allow change only if timer is not active
    if (!isActive) {
      // Destructure the name and value from the event target, which is the input field
      const { name, value } = e.target
      if (name === 'minutesInput') {
        if (validateMinutes(value) || value === '') {
          setMinutesInput(value)
          setIsMinutesChanged(true)
          // Reset time input when minutes are changed
          setTimeInput('')
          if (value === '') {
            setError('')
          }
        }
      } else if (name === 'timeInput') {
        if (validateTimeInput(value) || value === '') {
          setTimeInput(value)
          // Reset minutes input when time is changed
          setMinutesInput('')
          if (value === '') {
            setError('')
          }
        }
      }
    }
  }

  const handleSubmit = (e) => {
    // Prevent the default form submission behavior, like refreshing the page
    e.preventDefault()

    toggle()
  }

  const handleNameFocus = (e) => {
    // Select all text inside the input when it gains focus
    e.target.select()
  }

  const handleNameChange = (e) => {
    setTimerName(e.target.value)
  }

  // Calculate minutes and seconds for display
  const displayMinutes = Math.floor(seconds / 60)
  const displaySeconds = seconds % 60

  return (
    <div className='mt-4'>
      {/* Only show the countdown circle when the timer is active */}
      {((minutesInput || timeInput) && isStarted) && <CountdownCircle size={200} strokeWidth={10} seconds={seconds} totalSeconds={totalSeconds} />}

      {/* Display both minutes and seconds */}
      {/* Use padStart to ensure that seconds are always displayed with two digits, prefixing a '0' when necessary */}
      <h2 className='color-2-text m-3'>{`${displayMinutes}m : ${displaySeconds.toString().padStart(2, '0')}s`}</h2>

      {/* //^^ Can't change name by pressing enter, but is it important? */}
      <input 
        type="text" 
        value={timerName} 
        onChange={handleNameChange} 
        onFocus={handleNameFocus}
        placeholder="Name of the timer" 
        className='form-control mb-3' 
      />

      {error && <div className='color-3-text m-2'>{error}</div>}

      {/* If the user presses Enter, the form will submit and the timer will start */}
      <form onSubmit={handleSubmit} className="container">
        <div className="row">

          <div className="w-50">
            <input
              type="number"
              name="minutesInput"
              value={minutesInput}
              onChange={handleChange}
              placeholder="Minutes"
              disabled={isActive || timeInput}
              // If the timer is active, hence the input field is disabled, change the color of the input field
              className={`form-control mb-3 ${(isActive || timeInput) ? 'color-4' : ''}`}
            />
          </div>

        {/* //^^ Can't add timer by pressing enter, but is that important? */}
          <div className="w-50">
            <input
              type="time"
              name="timeInput"
              value={timeInput}
              onChange={handleChange}
              placeholder="HH:MM"
              disabled={isActive || minutesInput}
              // If the timer is active, hence the input field is disabled, change the color of the input field
              className={`form-control mb-3 ${(isActive || minutesInput) ? 'color-4' : ''}`} 
            />
          </div>

        </div>
        <div className="row">
          <div className="col-md-12">
            {/* //TODO: Make the buttons to components */}
            <button type='button' onClick={toggle} className='color-2 btn mx-3'>{isActive ? 'Pause' : 'Start'}</button>
            <button type='button' onClick={reset} className='color-4 color-2-text btn mx-3'>Reset</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default MainTimer
