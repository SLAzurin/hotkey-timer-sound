import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import hotkeys from './hotkeys'

const { protocol } = window.require('electron')
const url = window.require('url')

// use this to determine whether to hack behaviour because it's running from web server instead of from file system
const isRunningFromWebServer = __dirname.includes('.webpack')

// not defined in https://en.wikipedia.org/wiki/List_of_URI_schemes, used as a hack when running from web server
const schemeName = 'local'
const scheme = `${schemeName}://`

;(window as any).convertPathToUrl = (path: string) => {
  return !isRunningFromWebServer
    ? url.pathToFileURL(path).toString()
    : `${scheme}${encodeURIComponent(path)}`
}
;(function () {
  if (!isRunningFromWebServer) return
  protocol.registerFileProtocol(schemeName, (request, callback) => {
    // undo the mangling that was done in convertPathToUrl
    const path = decodeURIComponent(request.url.slice(scheme.length))
    try {
      return callback(path)
    } catch (error) {
      console.error(
        `ERROR: registerFileProtocol: Could not get file path: error: ${error}, path: ${path}`,
      )
    }
  })
})()

const root = ReactDOM.createRoot(document.getElementById('root'))
;((window as any).globalHotkeyFunctions as { [key: string]: Function | null }) =
  {}
hotkeys.forEach((hotkey) => {
  ;(window as any).globalHotkeyFunctions[hotkey] = null
})

root.render(
  <React.StrictMode>
    <App hotkeys={hotkeys} />
  </React.StrictMode>,
)
