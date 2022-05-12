import React, {useCallback} from 'react'
import {Form} from "../../components/form";
import {useHaikuList} from "../../hooks";
import {withAuthGuard} from "../../hocs";

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

  const onSubmit = useCallback(async ({values: { text, price }, form }) => {
    await addHaiku({ text, price });
    form.reset();
  }, [addHaiku])

  return (
    <>
      <main>
        <Form onSubmit={onSubmit}>
          <div style={formLayoutStyle} >
            <textarea
              name="text"
              autoComplete="off"
              placeholder='Haiku text'
              style={textareaStyle}
            />
            <input
              name="price"
              autoComplete="off"
              placeholder='Price'
            />
            <button>Add haiku</button>
          </div>
          <pre>{JSON.stringify(haikuList, null, '  ')}</pre>
        </Form>
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
