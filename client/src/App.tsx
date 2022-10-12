/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {Suspense, useState} from 'react';
import {useTranslation} from 'react-i18next';

import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const {t, i18n} = useTranslation();

  return (
    <Suspense fallback="Loading...">
      <div className="App">
        <>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
        </>

        <h1>Cryoto</h1>
        <div className="card">
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </Suspense>
  );
}
export default App;
