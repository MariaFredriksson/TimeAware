import alarmSoundSrc from '../assets/sounds/alarmSound.mp3'
// const alarmAudio = new Audio(alarmSoundSrc)

export const playAlarm = () => {
  const alarmAudio = new Audio(alarmSoundSrc)
  alarmAudio.play()
  return alarmAudio // Return the audio instance so that it can be stopped later

  // alarmAudio.play()
}

export const stopAlarm = (alarmAudio) => {
  alarmAudio.pause()
  alarmAudio.currentTime = 0 // Rewind to the start
}
