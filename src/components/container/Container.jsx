import React from 'react'

function Container({children}) {
  return (
    <div className=' mx-auto max-w-screen-2xl bg-gray-700 my-6'>{children}</div>
  )
}

export default Container