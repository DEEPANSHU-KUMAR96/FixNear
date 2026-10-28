import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/App.css'
import App from './app/App.jsx'
import { store } from './app/srore'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
