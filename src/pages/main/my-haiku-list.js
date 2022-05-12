import React, {memo, useCallback} from 'react'
import {List} from '../../components/list'
import {useHaikuContext} from '../../hooks'
import {Haiku} from './haiku'

const renderToolbar = ({id}) => <><button onClick={() => removeHaiku({id})}>Remove</button></>

export const MyHaikuList = memo(function MyHaikuList (props) {
  const {haikuList, removeHaiku} = useHaikuContext();

  const renderItem = useCallback((item) => <div>
    <Haiku data={item} renderToolbar={renderToolbar}/>
  </div>, [removeHaiku])

  return <List items={haikuList} renderItem={renderItem} {...props}/>;
})
