import Timer from "./Timer"

const App = ({ hotkeys }: { hotkeys: string[] }) => {
  return (
    <div id="main-container" >
      {hotkeys.map((hotkey) => (
        <Timer key={'react-key-' + hotkey} hotkey={hotkey} />
      ))}
    </div>
  )
}

export default App
