import React, {useCallback} from 'react'
import {HaikuForm} from "./haiku-form";
import {useHaikuList} from "../../hooks";
import {withAuthGuard} from "../../hocs";

export const AddHaiku = withAuthGuard(function AddHaiku(props) {
  const {haikuList, addHaiku, buyHaiku} = useHaikuList();

  const onSubmit = useCallback(async ({values: { text, price }, form }) => {
    await addHaiku({ text, price });
    form.reset();
  }, [addHaiku])

  return (
    <main>
      <HaikuForm onSubmit={onSubmit} submitText='Add haiku' {...props} />
      <pre>{JSON.stringify(haikuList, null, '  ')}</pre>
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
  )
})
