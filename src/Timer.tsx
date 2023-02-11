import { useEffect, useRef, useState } from 'react'
import { convertBase64 } from './helper'

const Timer = ({ hotkey }: { hotkey: string }) => {
  const [filePath, setFilePath] = useState('')
  const filePathRef = useRef(filePath)
  filePathRef.current = filePath
  const [volume, setVolume] = useState(10)
  const [duration, setDuration] = useState(10)
  const durationRef = useRef(duration)
  durationRef.current = duration
  const [playerError, setPlayerError] = useState('')
  const [isPlaying, setPlaying] = useState(false)
  const [timers, setTimers] = useState<any>()
  const timersRef = useRef(timers)
  timersRef.current = timers
  const [remainingTime, setRemainingTime] = useState(duration * 1000)
  const intervalTime = 100
  const [loadingAudio, setLoadingAudio] = useState(false)

  const onHotkey = () => {
    console.log('onHotkey', hotkey)
    startTimer()
  }
  useEffect(() => {
    ;(window as any).globalHotkeyFunctions[hotkey].player.src = filePath
  }, [filePath])

  useEffect(() => {
    ;(window as any).globalHotkeyFunctions[hotkey].player.volume = volume / 100
  }, [volume])

  useEffect(() => {
    ;(window as any).globalHotkeyFunctions[hotkey].fn = () => {
      onHotkey()
    }
    ;(window as any).globalHotkeyFunctions[hotkey].player.onended = () => {
      setPlaying(false)
    }
  }, [])

  const playPause = () => {
    if (filePathRef.current === '') return
    if (
      (window as any).globalHotkeyFunctions[hotkey].player.currentTime === 0 ||
      (window as any).globalHotkeyFunctions[hotkey].player.ended
    ) {
      ;(window as any).globalHotkeyFunctions[hotkey].player.currentTime = 0
      ;(window as any).globalHotkeyFunctions[hotkey].player
        .play()
        .then(() => {
          setPlayerError('')
          setPlaying(true)
        })
        .catch((e: any) => {
          setPlayerError(e.toString())
          setPlaying(false)
        })
    } else {
      setPlaying(false)
      ;(window as any).globalHotkeyFunctions[hotkey].player.pause()
      ;(window as any).globalHotkeyFunctions[hotkey].player.currentTime = 0
    }
  }

  const startTimer = () => {
    if (filePathRef.current === '') return
    if (timersRef.current) {
      clearInterval(timersRef.current.interval)
      clearTimeout(timersRef.current.timeout)
      setTimers(null)
      setRemainingTime(durationRef.current * 1000)
      return
    }
    setPlaying(false)
    ;(window as any).globalHotkeyFunctions[hotkey].player.pause()
    ;(window as any).globalHotkeyFunctions[hotkey].player.currentTime = 0
    setTimers({
      timeout: setTimeout(() => {
        clearInterval(timersRef.current.interval)
        clearTimeout(timersRef.current.timeout)
        setTimers(null)
        setRemainingTime(durationRef.current * 1000)
        playPause()
      }, durationRef.current * 1000),
      interval: setInterval(() => {
        setRemainingTime((remainingTime) =>
          remainingTime >= intervalTime
            ? remainingTime - intervalTime
            : remainingTime,
        )
        if (remainingTime <= 0) {
          clearInterval(timersRef.current.interval)
        }
      }, intervalTime),
    })
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Timer for {hotkey}</h1>
      <div id="main-container">
        <button
          id="start-button"
          onClick={() => {
            startTimer()
          }}
        >
          Start Timer
        </button>
        <p id="timer">Time remaining: {(remainingTime / 1000).toFixed(1)}s</p>
        <hr />
        <input
          type="number"
          min="1"
          step="1"
          value={duration}
          onChange={(e) => {
            setDuration(Number(e.target.value))
            setRemainingTime(Number(e.target.value) * 1000)
          }}
        ></input>
        <button
          id="test-audio"
          onClick={() => {
            playPause()
          }}
        >
          {isPlaying ? 'Pause' : 'Play'} audio
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
          style={{ display: 'none' }}
          id="mp3-file"
          type="file"
          accept="audio/*"
          onChange={async (e) => {
            if (e.target.files[0]) {
              const base64: string = (await convertBase64(
                e.target.files[0],
              )) as string
              setFilePath(base64)
            }
            setLoadingAudio(false)
          }}
        />
        {filePath !== '' ? (
          <button
            onClick={() => {
              setFilePath('')
            }}
          >
            Unset audio track
          </button>
        ) : (
          <button
            onClick={() => {
              setLoadingAudio(true)
              document.getElementById('mp3-file').click()
            }}
          >
            {loadingAudio ? 'Loading...' : 'Set audio track'}
          </button>
        )}
      </div>
      <p style={{ color: 'red' }}>{playerError}</p>
      <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }} />
    </div>
  )
}

export default Timer
