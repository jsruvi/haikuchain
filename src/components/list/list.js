import React, {memo, useMemo} from 'react'

const itemStyle = {
  padding: '10px',
  borderBottom: '1px solid black'
}

export const List = memo(function List({items: itemsFromProps, renderItem, ...props}) {
  const items = useMemo(() =>
    itemsFromProps.map(item => <div key={item.id} style={itemStyle}>{renderItem(item)}</div>),
    [itemsFromProps, renderItem]
  );

  return (
    <div {...props}>
      {items}
    </div>
  )
})
