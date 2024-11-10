import React from 'react'

function Logo({
    className,
    imageSrc
}) {
  return (
    <div className={`w-24 ${className}`}>
        <img src={imageSrc} alt='logo' />
        
    </div>
  )
}

export default Logo