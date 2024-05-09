import alarmSoundSrc from '../assets/sounds/alarmSound.mp3'
const alarmAudio = new Audio(alarmSoundSrc)

export const playAlarm = () => {
  alarmAudio.play()
}

export const stopAlarm = () => {
  alarmAudio.pause()
  alarmAudio.currentTime = 0 // Rewind to the start
}
