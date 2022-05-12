import React, {memo, useCallback, useState, useMemo} from 'react'
import {List} from '../../components/list'
import {useHaikuContext} from '../../hooks'
import {HaikuForm} from './haiku-form'
import {Haiku} from './haiku'

const Toolbar = ({id, selling, text, price}) => {
  const {removeHaiku, toggleHaikuSelling, editHaiku} = useHaikuContext();
  const [edit, setEdit] = useState(false);

  const onEditSubmit = useCallback(async ({values: {text, price}}) => {
    setEdit(false);
    await editHaiku({id, text, price})
  }, [setEdit])

  const initialValues = useMemo(() => ({text, price}), [text, price]);

  return <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10}}>
      <button onClick={() => removeHaiku({id})}>Remove</button>
      {selling ? 'selling' : <button onClick={() => toggleHaikuSelling({id})}>Sell</button>}
      {selling ? null : <button onClick={() => setEdit(!edit)}>{edit ? 'Cancel Edit' : 'Edit'}</button>}
    </div>
    {edit ? <div style={{borderTop: '1px solid black', marginTop: 20}}>
      <HaikuForm initialValues={initialValues} submitText='Update' onSubmit={onEditSubmit} />
    </div> : null}
  </>
}
const renderToolbar = ({id, text, price, selling}) => <Toolbar id={id} selling={selling} text={text} price={price}/>

const renderItem = (item) => <div>
  <Haiku data={item} renderToolbar={renderToolbar}/>
</div>

export const MyHaikuList = memo(function MyHaikuList (props) {
  const {haikuList} = useHaikuContext();

  return <List items={haikuList} renderItem={renderItem} {...props}/>;
})
