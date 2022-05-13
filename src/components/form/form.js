import React, {memo, useEffect, useCallback, useRef, useState} from 'react'
import {Loader} from '../loader'

const formStyle = {
  position: 'relative',
  padding: '30px 20px'
}

const errorStyle = {
  border: '1px solid red',
  padding: 20,
  marginBottom: 20,
}

export const Form = memo(function Form({initialValues = {}, style, onSubmit: onSubmitFromProps, children, ...props})  {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    setError(null)
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

    try {
      await onSubmitFromProps({ values, form })
    } catch (error) {
      if (mountedRef.current) {
        setError(error.message)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [onSubmitFromProps])

  return (
    <form ref={formRef} style={{...formStyle, ...style}} onSubmit={onSubmit} {...props}>
      {loading ? <Loader /> : null}
      {error ? <div style={errorStyle}>{error}</div> : null}
      {children}
    </form>
  )
})
