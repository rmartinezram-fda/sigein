import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <--- ¡ESTO ES CRUCIAL!
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- Si falta esto, los botones mueren */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)