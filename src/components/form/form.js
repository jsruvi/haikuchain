import React, {memo, useEffect, useCallback, useRef} from 'react'

const formStyle = {
  padding: '30px 20px'
}

export const Form = memo(function Form({initialValues = {}, style, onSubmit: onSubmitFromProps, ...props})  {
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
  }, [onSubmitFromProps])

  return (
     <form ref={formRef} style={{...formStyle, ...style}} onSubmit={onSubmit} {...props}/>
  )
})
