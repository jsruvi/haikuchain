import React, {memo} from 'react'
import {List} from '../../components/list'
import {useHaikuContext} from '../../hooks'
import {Haiku} from './haiku'

const renderItem = ({text, price}) => <div>
  <Haiku text={text} price={price}/>
</div>

export const MyHaikuList = memo(function MyHaikuList (props) {
  const {haikuList} = useHaikuContext();

  return <List items={haikuList} renderItem={renderItem} {...props}/>;
})
