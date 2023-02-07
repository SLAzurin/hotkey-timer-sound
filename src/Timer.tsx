import { useEffect, useState } from 'react'
import { convertBase64 } from './helper'

const Timer = ({ hotkey }: { hotkey: string }) => {
  const [filePath, setFilePath] = useState('')
  const [volume, setVolume] = useState(10)
  const [duration, setDuration] = useState(10)
  const [playerError, setPlayerError] = useState('')
  const onHotkey = () => {
    console.log('onHotkey', hotkey)
  }
  useEffect(() => {
    // console.log('Setting player src', filePath)
    ;(window as any).globalHotkeyFunctions[hotkey].player.src = filePath
  }, [filePath])

  useEffect(() => {
    ;(window as any).globalHotkeyFunctions[hotkey].player.volume = volume / 100
  }, [volume])

  useEffect(() => {
    ;(window as any).globalHotkeyFunctions[hotkey].fn = () => {
      onHotkey()
    }
  }, [])

  const playPause = () => {
    if (
      (window as any).globalHotkeyFunctions[hotkey].player.currentTime === 0
    ) {
      ;(window as any).globalHotkeyFunctions[hotkey].player
        .play()
        .then(() => {
          setPlayerError('')
        })
        .catch((e: any) => {
          setPlayerError(e.toString())
        })
    } else {
      ;(window as any).globalHotkeyFunctions[hotkey].player.pause()
      ;(window as any).globalHotkeyFunctions[hotkey].player.currentTime = 0
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
          type="file"
          accept="audio/mpeg"
          onChange={async (e) => {
            console.log(e.target.files[0])
            if (e.target.files[0]) {
              const base64: string = (await convertBase64(
                e.target.files[0],
              )) as string
              setFilePath(base64)
            }
          }}
        />
      </div>
      <p style={{ color: 'red' }}>{playerError}</p>
      <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }} />
    </div>
  )
}

export default Timer
