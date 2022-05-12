import React from 'react'
import {useHaikuList} from "../../hooks";
import {withAuthGuard} from "../../hocs";

const formStyle = {
  padding: '30px 20px'
}

const formLayoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}

const textareaStyle = {
  width: '100%',
  height: '300px',
  resize: 'none',
  padding: '20px'
}

export const HaikuForm = withAuthGuard(() => {
  const {haikuList, addHaiku, buyHaiku} = useHaikuList();

  return (
    <>
      <main>
        <form style={formStyle} onSubmit={async event => {
          event.preventDefault()
          const { text } = event.target.elements

          addHaiku(text.value)
        }}>
          <div style={formLayoutStyle} >
            <textarea
              autoComplete="off"
              placeholder='Haiku text'
              style={textareaStyle}
              id="text"
            />
            <input
              autoComplete="off"
              placeholder='Price'
              id="price"
            />
            <button>Add haiku</button>
          </div>
          {/*<pre>{JSON.stringify(haikuList, null, '  ')}</pre>*/}
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
