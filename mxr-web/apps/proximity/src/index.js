import React from 'react'
import ReactDOM from 'react-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain='mxr.auth0.com'
      clientId='qCDYYqJ5Np70iy66VqweQSwoRO0ZVZjM'
      redirectUri={window.location.origin}
      audience='http://pankaj.moolrajani.sb.intern.monoxor.com:8080/open'
      scope='openid email profile'
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
