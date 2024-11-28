import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/index.ts'

if(document.getElementById('root')) {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
    
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
    
      </React.StrictMode>,
    )
  }
}