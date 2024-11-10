import React from 'react'

function Container({children, className}) {
  return (
    <div className= {`${className} max-w-screen-2xl mx-auto h-screen bg-gray-500 `}  >{children}</div>
  )
}

export default Container