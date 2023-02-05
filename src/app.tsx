import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    (window as any).onHotkey = onHotkey;
  }, []);

  const onHotkey = (hotkey: Electron.Accelerator) => {
    console.log(hotkey);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button id="start-button"></button>
      </header>
    </div>
  );
};

export default App;
