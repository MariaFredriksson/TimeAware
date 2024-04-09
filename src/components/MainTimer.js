import { useState, useEffect } from 'react'

const MainTimer = () => {
  const [seconds, setSeconds] = useState(0)
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
    }

    // Clean-up function that first cleans up the previous effect before applying the next effect
    // and also prevents eventual side effects when the component is unmounted from the DOM
    return () => clearInterval(intervalID)

    // When the isActive or seconds state changes, the useEffect function will run again
  }, [isActive, seconds])

  const toggle = () => {
    if (seconds > 0) {
      setIsActive(!isActive)
    } else {
      // Prevent the timer from starting if seconds are 0
      setIsActive(false)
    }
  }

  const reset = () => {
    setSeconds(0)
    setIsActive(false)
  }

  const handleChange = (e) => {
    // Convert minutes to seconds for internal storage
    setSeconds(e.target.value * 60)
  }

  // Calculate minutes and seconds for display
  const displayMinutes = Math.floor(seconds / 60)
  const displaySeconds = seconds % 60

  return (
    <div>
      <input type="number" value={displayMinutes} onChange={handleChange} />
      <button onClick={toggle}>{isActive ? 'Pause' : 'Start'}</button>
      <button onClick={reset}>Reset</button>
      {/* Display both minutes and seconds */}
      {/* Use padStart to ensure that seconds are always displayed with two digits, prefixing a '0' when necessary */}
      <h2>{`${displayMinutes}m : ${displaySeconds.toString().padStart(2, '0')}s`}</h2>
    </div>
  )
}

export default MainTimer
