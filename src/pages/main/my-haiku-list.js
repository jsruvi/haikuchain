import React, {memo, useCallback} from 'react'
import {List} from '../../components/list'
import {useHaikuContext} from '../../hooks'
import {Haiku} from './haiku'

export const MyHaikuList = memo(function MyHaikuList (props) {
  const {haikuList, removeHaiku, toggleHaikuSelling} = useHaikuContext();

  const renderToolbar = useCallback(({id, selling}) => <>
    <button onClick={() => removeHaiku({id})}>Remove</button>
    {selling ? 'selling' : <button onClick={() => toggleHaikuSelling({id})}>Sell</button>}
  </>, [removeHaiku, toggleHaikuSelling])

  const renderItem = useCallback((item) => <div>
    <Haiku data={item} renderToolbar={renderToolbar}/>
  </div>, [renderToolbar])

  return <List items={haikuList} renderItem={renderItem} {...props}/>;
})
