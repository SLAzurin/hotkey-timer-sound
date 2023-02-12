import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import hotkeys from './hotkeys'
;((window as any).globalHotkeyFunctions as {
  [key: string]: { fn: () => void | null; player: HTMLAudioElement }
}) = {}
hotkeys.forEach((hotkey) => {
  ;(window as any).globalHotkeyFunctions[hotkey] = {
    fn: null,
    player: new (window as any).Audio(),
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(React.createElement(App, { hotkeys }))
