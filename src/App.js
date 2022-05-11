import 'regenerator-runtime/runtime'
import React from 'react'
import './global.css'
import {Login} from './pages/login'
import {HaikuForm} from './pages/haiku-form'

export default function App() {
  return window.walletConnection.isSignedIn() ? <HaikuForm /> : <Login />
}
