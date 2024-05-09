class AudioManager {
  constructor() {
    this.audio = new Audio()
    this.isPlaying = false
  }

  playSound(url) {
    console.log(url)
    if (!this.isPlaying) {
      this.audio.src = url
      this.audio.play()
      this.isPlaying = true
      this.audio.onended = () => {
        this.isPlaying = false
      }
    }
  }

  stopSound() {
    if (this.isPlaying) {
      this.audio.pause()
      this.audio.currentTime = 0
      this.isPlaying = false
    }
  }
}

const audioManager = new AudioManager()
export default audioManager
