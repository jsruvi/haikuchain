import React, {memo} from 'react'

export const Haiku = memo(function Haiku ({text, price}) {
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
    </div>
  )
})
