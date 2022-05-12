import React, {memo, useEffect, useCallback, useRef, useState} from 'react'
import {Loader} from '../loader'

const formStyle = {
  position: 'relative',
  padding: '30px 20px'
}

export const Form = memo(function Form({initialValues = {}, style, onSubmit: onSubmitFromProps, children, ...props})  {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (!formRef.current) {
      return;
    }

    Array.from(formRef.current.elements).forEach(el => {
      if (!el.name || !(el.name in initialValues)) {
        return;
      }

      el.value = initialValues[el.name]
    })
  }, [initialValues])

  const onSubmit = useCallback(async event => {
    setLoading(true)
    event.preventDefault()

    const form = event.target;

    const values = Array.from(form.elements).reduce((result, {name, value}) => {
      if (!name) {
        return result;
      }

      return {
        ...result,
        [name]: value
      };
    }, {});

    await onSubmitFromProps({ values, form })
    setLoading(false)
  }, [onSubmitFromProps])

  return (
    <form ref={formRef} style={{...formStyle, ...style}} onSubmit={onSubmit} {...props}>
      {loading ? <Loader /> : null}
      {children}
    </form>
  )
})
