import React, {memo, useEffect, useCallback, useRef, useState} from 'react'

const formStyle = {
  position: 'relative',
  padding: '30px 20px'
}

const loaderStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'white'
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
      {loading ? <div style={loaderStyle}>Loading...</div> : null}
      {children}
    </form>
  )
})
