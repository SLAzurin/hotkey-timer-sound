import { useEffect, useState } from 'react'

const Timer = ({ hotkey }: { hotkey: string }) => {
  const [filePath, setFilePath] = useState('./Discotheque.mp3')
  const [volume, setVolume] = useState(10)
  const [player] = useState(new Audio())
  const [duration, setDuration] = useState(10)
  const [playerError, setPlayerError] = useState('')
  const onHotkey = () => {
    console.log('onHotkey', hotkey)
  }
  useEffect(() => {
    console.log('Setting player src', filePath)
    player.src = (window as any).convertPathToUrl(filePath).toString()
  }, [filePath, player])

  useEffect(() => {
    player.volume = volume / 100
  }, [volume])

  useEffect(() => {
    console.log(hotkey)
    ;(window as any).globalHotkeyFunctions[hotkey] = () => {
      onHotkey()
    }
  }, [])

  const playPause = () => {
    if (player.currentTime === 0) {
      player
        .play()
        .then(() => {
          setPlayerError('')
        })
        .catch((e) => {
          setPlayerError(e.toString())
        })
    } else {
      player.pause()
      player.currentTime = 0
    }
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Timer for {hotkey}</h1>
      <div id="main-container">
        <button id="start-button">Start Timer</button>
        <p id="timer">Time remaining: {}s</p>
        <hr />
        <button
          id="test-audio"
          onClick={() => {
            playPause()
          }}
        >
          Play/Stop audio
        </button>
        <div>
          <label htmlFor="volume">Volume: </label>
          <input
            id="volume-slider"
            name="volume"
            type="range"
            min="1"
            max="100"
            value={volume}
            onChange={(e) => {
              setVolume(Number(e.target.value))
            }}
          />
        </div>
        <input
          id="mp3-file"
          type="text"
          placeholder="Discotheque.mp3"
          value={filePath}
          onChange={(e) => {
            setFilePath(e.target.value)
          }}
        />
      </div>
      <p style={{ color: 'red' }}>{playerError}</p>
      <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }} />
    </div>
  )
}

export default Timer
