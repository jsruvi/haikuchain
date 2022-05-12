import React, {memo, useCallback} from 'react'
import {withAuthGuard} from "../../hocs";
import {useHaikuList} from "../../hooks";

const formStyle = {
  padding: '30px 20px'
}

export const Form = memo(function Form({onSubmit: onSubmitFromProps, ...props})  {
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
     <form style={formStyle} onSubmit={onSubmit} {...props}/>
  )
})
