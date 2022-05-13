import React, {memo, useMemo} from 'react'
import {useHaikuContext} from "../../hooks";
import {Loader} from '../../components/loader'

const defaultRenderToolbar = () => null

export const Haiku = memo(function Haiku ({data, renderToolbar = defaultRenderToolbar}) {
  const {pendingChange} = useHaikuContext();
  const {text, price} = data;
  const toolbar = useMemo(() => renderToolbar(data), [renderToolbar, data]);

  return (
    <div style={{position: 'relative'}}>
      {pendingChange ? <Loader /> : null}
      <div style={{marginBottom: 20}}>
        <i>
          {text.split('\n').map(function(item, index) {
              return (
                <span key={index}>
                  {item}
                  <br/>
                </span>
              )
            })}
        </i>
      </div>
      <div>
        price: {price} NEAR
      </div>
      {toolbar ? <div style={{paddingTop: 20}}>{toolbar}</div> : null}
    </div>
  )
})
