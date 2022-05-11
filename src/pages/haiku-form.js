import React from 'react'
import {useHaikuList} from "../hooks";
import {withAuthGuard} from "../hocs";
import {logout} from "../utils";

export const HaikuForm = withAuthGuard(() => {
  const {haikuList, addHaiku, buyHaiku} = useHaikuList();

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
        <button
          onClick={() => {
            // TODO move to correct place and use correct haiku id
            buyHaiku('123')
          }}
          style={{ borderRadius: '0 5px 5px 0' }}
        >
          Buy
        </button>
      </main>
    </>
  )
})
