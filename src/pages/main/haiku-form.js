import React, {memo} from 'react'
import {Form} from "../../components/form";

const formStyle = {
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

export const HaikuForm = memo(function HaikuForm ({submitText, ...props}) {
  return (
    <Form style={formStyle} {...props}>
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
        <button>{submitText}</button>
    </Form>
  )
})
