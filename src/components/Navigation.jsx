import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Navigation({className, navItems, logoClassName}) {

  return (
    <>
         {navItems.map((item) => {
                    if(item.length > 2){ 

                       return item.status && (
                        <li className={className} key={item.name}>
                            <Link  to={item.slug}>
                            <FontAwesomeIcon className={logoClassName} icon={item.logo}/>

                             {item.name} 
                             
                            </Link>
                            </li>
                            
                        )
                    }else {
                        return (
                         <NavLink key={item.name}  to={item.slug} className={className}>{item.name}</NavLink>
                        )
                    }
                    
})}
    </>
  )
}

export default Navigation