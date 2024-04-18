import { useState, useEffect } from 'react'

const SubTimer = ({ isActive, addedSubTimer }) => {
  const [seconds, setSeconds] = useState(0)
  const [minutesInput, setMinutesInput] = useState('')
  // const [isActive, setIsActive] = useState(false)
  let displayMinutes = 0
  let displaySeconds = 0
  let inputSeconds = 0

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
      // setIsActive(false)
      // ^^ How can I play the alarm in the parent?
      // playAlarm()
    }

    // Clean-up function that first cleans up the previous effect before applying the next effect
    // and also prevents eventual side effects when the component is unmounted from the DOM
    return () => clearInterval(intervalID)

    // When the isActive or seconds state changes, the useEffect function will run again
  }, [isActive, seconds])

  // Calculate minutes and seconds for display
  displayMinutes = Math.floor(seconds / 60)
  displaySeconds = seconds % 60

  const addTimer = () => {
    if (!isActive && minutesInput) {
      // Convert and set the timer only if it's not already active and there's input
      inputSeconds = parseInt(minutesInput, 10) * 60
      // setSeconds(inputSeconds)
      // setIsActive(true)
      addedSubTimer(inputSeconds)
      displayMinutes = Math.floor(inputSeconds / 60)
      displaySeconds = inputSeconds % 60
      console.log('Adding sub-timer')
      console.log('inputSeconds:', inputSeconds)
    }
  }

  // const startTimer = () => {
  //   setSeconds(inputSeconds)
  //   // setIsActive(true)
  // }

  const handleSubmit = (e) => {
    // Prevent the default form submission behavior, like refreshing the page
    e.preventDefault()

    addTimer()
  }

  const handleChange = (e) => {
    // Allow change only if timer is not active
    if (!isActive) {
      setMinutesInput(e.target.value)
    }
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Sub-timer minutes"
          value={minutesInput}
          onChange={handleChange}
        />
        <button type='button' onClick={addTimer}>Add</button>
      </form>
      
      {/* Display both minutes and seconds */}
      {/* Use padStart to ensure that seconds are always displayed with two digits, prefixing a '0' when necessary */}
      <h2>{`${displayMinutes}m : ${displaySeconds.toString().padStart(2, '0')}s`}</h2>
    </div>
  )
}

export default SubTimer