import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'
import {useHaikuList} from './hooks'

export default function App() {
  const {haikuList, addHaiku} = useHaikuList();

  console.log('haikuList', haikuList);

  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p>
          To make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          By default, when your app runs in "development" mode, it connects
          to a test network ("testnet") wallet. This works just like the main
          network ("mainnet") wallet, but the NEAR Tokens on testnet aren't
          convertible to other currencies – they're just for testing!
        </p>
        <p>
          Go ahead and click the button below to try it out:
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  return (
    <>
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      <main>
        <form onSubmit={async event => {
          event.preventDefault()
          const { text } = event.target.elements

          addHaiku(text.value)
        }}>
          <fieldset id="fieldset">
            <label
              htmlFor="text"
              style={{
                display: 'block',
                color: 'var(--gray)',
                marginBottom: '0.5em'
              }}
            >
              Change text
            </label>
            <div style={{ display: 'flex' }}>
              <input
                autoComplete="off"
                id="text"
                style={{ flex: 1 }}
              />
              <button
                style={{ borderRadius: '0 5px 5px 0' }}
              >
                Save
              </button>
            </div>
          </fieldset>
          <pre>{JSON.stringify(haikuList, null, '  ')}</pre>
        </form>
      </main>
    </>
  )
}
