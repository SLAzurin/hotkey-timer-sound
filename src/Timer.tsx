import { useEffect, useRef, useState } from 'react'
import { convertBase64 } from './helper'
const { ipcRenderer } = window.require('electron')

const Timer = ({ hotkey }: { hotkey: string }) => {
  const setStoreValue = (key: string, value: any) => {
    ipcRenderer.send('setStoreValue', hotkey, key, value)
  }
  const getStoreValue = (key: string, defaults: any) => {
    return ipcRenderer.invoke('getStoreValue', hotkey, key, defaults)
  }
  const [filePath, setFilePath] = useState({ default: true, value: '' })
  const filePathRef = useRef(filePath.value)
  filePathRef.current = filePath.value
  const [volume, setVolume] = useState({ default: true, value: 10 })
  const [duration, setDuration] = useState({ default: true, value: 10 })
  const durationRef = useRef(duration.value)
  durationRef.current = duration.value
  const [playerError, setPlayerError] = useState('')
  const [isPlaying, setPlaying] = useState(false)
  const [timers, setTimers] = useState<any>()
  const timersRef = useRef(timers)
  timersRef.current = timers
  const [remainingTime, setRemainingTime] = useState(duration.value * 1000)
  const intervalTime = 100
  const [loadingAudio, setLoadingAudio] = useState(false)

  const onHotkey = () => {
    startTimer()
  }
  useEffect(() => {
    ;(window as any).globalHotkeyFunctions[hotkey].player.src = filePath.value
    if (!filePath.default)
      setStoreValue(`${hotkey}.src`, filePath.value.match(/.{1,40}/g) ?? [])
  }, [filePath])

  useEffect(() => {
    ;(window as any).globalHotkeyFunctions[hotkey].player.volume =
      volume.value / 100
    if (!volume.default) setStoreValue(hotkey + '.vol', volume.value)
  }, [volume])

  useEffect(() => {
    if (!duration.default) setStoreValue(hotkey + '.duration', duration.value)
  }, [duration])

  useEffect(() => {
    ;(window as any).globalHotkeyFunctions[hotkey].fn = () => {
      onHotkey()
    }
    ;(window as any).globalHotkeyFunctions[hotkey].player.onended = () => {
      setPlaying(false)
    }
    ;(async () => {
      const { src, vol, duration } = await getStoreValue(hotkey, {
        src: '',
        vol: 10,
        duration: 10,
      })
      if (src !== '') {
        setFilePath({ default: false, value: src.join('') })
      }
      if (vol) {
        setVolume({ default: false, value: vol })
      }
      if (duration) {
        setDuration({ default: false, value: duration })
        setRemainingTime(duration * 1000)
      }
    })()
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
          value={duration.value}
          onChange={(e) => {
            setDuration({ default: false, value: Number(e.target.value) })
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
            value={volume.value}
            onChange={(e) => {
              setVolume({ default: false, value: Number(e.target.value) })
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
              setFilePath({
                default: false,
                value: base64,
              })
            }
            setLoadingAudio(false)
          }}
        />
        {filePath.value !== '' ? (
          <button
            onClick={() => {
              setFilePath({ default: false, value: '' })
            }}
          >
            Unset
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
