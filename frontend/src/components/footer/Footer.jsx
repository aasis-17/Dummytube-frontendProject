import React from 'react'
import Container from '../container/Container'

function Footer() {
  return (
    // <Container>
    <div className="text-black sticky ">
       <div className=" mx-auto flex justify-between items-center ">
        <div className="flex space-x-4 ">
          {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center"> */}
            <img src="/path/to/facebook-logo.svg" alt="Facebook" className="w-6 h-6" />
            <span className="ml-2">Facebook</span>
          {/* </a> */}
          {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center"> */}
            <img src="/path/to/twitter-logo.svg" alt="Twitter" className="w-6 h-6" />
            <span className="ml-2">Twitter</span>
          {/* </a> */}
          {/* <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center"> */}
            <img src="/path/to/instagram-logo.svg" alt="Instagram" className="w-6 h-6" />
            <span className="ml-2">Instagram</span>
          {/* </a> */}
          {/* <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center"> */}
            <img src="/path/to/linkedin-logo.svg" alt="LinkedIn" className="w-6 h-6" />
            <span className="ml-2">LinkedIn</span>
          {/* </a> */}
        </div>
        <div>
          <p className="text-sm">&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
      </div>
    // </Container>
    
  )
}

export default Footer