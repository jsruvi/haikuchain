import React, {memo, useMemo} from 'react'

const defaultRenderToolbar = () => null

export const Haiku = memo(function Haiku ({data, renderToolbar = defaultRenderToolbar}) {
  const {text, price} = data;
  const toolbar = useMemo(() => renderToolbar(data), [renderToolbar, data]);

  return (
    <div>
      <div style={{marginBottom: 20}}>
        <i>
          {text.split('\n').map(function(item) {
              return (
                <span>
                  {item}
                  <br/>
                </span>
              )
            })}
        </i>
      </div>
      <div>
        price: {price}
      </div>
      {toolbar ? <div style={{paddingTop: 20}}>{toolbar}</div> : null}
    </div>
  )
})
