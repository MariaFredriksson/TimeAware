import { createContext, useContext } from 'react'
import audioManager from '../utils/AudioManager.js'

const AudioContext = createContext()

export function useAudio() {
  return useContext(AudioContext)
}

export const AudioProvider = ({ children }) => {
  const playSound = (soundUrl) => {
    audioManager.playSound(soundUrl)
  }

  const stopSound = () => {
    audioManager.stopSound()
  }

  return (
    <AudioContext.Provider value={{ playSound, stopSound }}>
      {children}
    </AudioContext.Provider>
  )
}
