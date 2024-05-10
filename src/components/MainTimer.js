import { useState, useEffect } from 'react'
import CountdownCircle from './CountdownCircle.js'

const MainTimer = ({ name, onTimerComplete  }) => {
  const getNextFullHour = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1) // Move to the next hour
    now.setMinutes(0) // Set minutes to 00
  
    const hours = now.getHours().toString().padStart(2, '0') // Ensure two-digit hour
    return `${hours}:00` // Format the time as "HH:00"
  }

  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [minutesInput, setMinutesInput] = useState('')
  const [timeInput, setTimeInput] = useState(getNextFullHour())
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
      onTimerComplete()
    }

    // Clean-up function that first cleans up the previous effect before applying the next effect
    // and also prevents eventual side effects when the component is unmounted from the DOM
    return () => clearInterval(intervalID)

    // When the isActive or seconds state changes, the useEffect function will run again
  }, [isActive, onTimerComplete, seconds])

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

    // Ensure the seconds and totalSeconds are whole numbers
    setSeconds(Math.floor(difference))
    setTotalSeconds(Math.floor(difference))
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

  const handleNameFocus = (e) => {
    // Select all text inside the input when it gains focus
    e.target.select()
  }

  const handleNameChange = (e) => {
    setTimerName(e.target.value);
  }

  // Calculate minutes and seconds for display
  const displayMinutes = Math.floor(seconds / 60)
  const displaySeconds = seconds % 60

  return (
    <div className='mt-4'>
      {/* Only show the countdown circle when the timer is active */}
      {(isActive || seconds > 0) && <CountdownCircle size={200} strokeWidth={10} seconds={seconds} totalSeconds={totalSeconds} />}

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
              disabled={isActive}
              // If the timer is active, hence the input field is disabled, change the color of the input field
              className={`form-control mb-3 ${isActive ? 'color-4' : ''}`}
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
              disabled={isActive}
              // If the timer is active, hence the input field is disabled, change the color of the input field
              className={`form-control mb-3 ${isActive ? 'color-4' : ''}`} 
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
