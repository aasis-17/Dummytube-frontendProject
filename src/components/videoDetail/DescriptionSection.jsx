import React from 'react'
import { useOutletContext } from 'react-router-dom'

function DescriptionSection() {

  const {description} = useOutletContext()
  return (
    <div>
        {description}
    </div>
  )
}

export default DescriptionSection