import { useState, useEffect } from 'react'

const SubTimer = ({ duration, onEnd }) => {
  const [subSeconds, setSubSeconds] = useState(duration * 60)

  useEffect(() => {
    let subInterval = null

    if (subSeconds > 0) {
      subInterval = setInterval(() => {
        setSubSeconds(subSeconds - 1)
      }, 1000)
    } else {
      clearInterval(subInterval)
      onEnd()  // Notify MainTimer of completion
    }

    return () => clearInterval(subInterval)
  }, [subSeconds])

  const displaySubMinutes = Math.floor(subSeconds / 60)
  const displaySubSeconds = subSeconds % 60

  return (
    <div>
      Sub-Timer: {displaySubMinutes}m : {displaySubSeconds.toString().padStart(2, '0')}s
    </div>
  )
}

export default SubTimer
