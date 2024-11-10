import React, { forwardRef } from 'react'
import { useId } from 'react'

function InputField({
    label,
    type="text",
    className,
    classLabel,
    ...props
},ref)
{
    const id = useId()
  return (
    // <div className='flex gap-2 items-center'>
    <>
      { label && <label className={`${classLabel}`} htmlFor={id}>{label}</label> }
        <input
            id={id}
            className={`outline-none ${className}`}
            type={type}
            {...props}
            ref={ref}
             />
    {/* // </div> */}
    </>
  )
}

export default forwardRef(InputField)