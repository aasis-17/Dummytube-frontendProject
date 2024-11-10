import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Navigation({navItems,className,classNameNav,  logoClassName}) {
  console.log(navItems)
  return (
    <>
         {navItems.map((item) => {
                  
                    if(item.hasOwnProperty("status") ){ 

                       return item.status && (
                        <li className={className } key={item.name}>
                            <NavLink  to={item.slug} className={classNameNav}>
                            {item.logo &&  
                            <FontAwesomeIcon className={logoClassName} icon={item.logo}/> }

                             {item.name} 
                             
                            </NavLink>
                            </li>
                            
                        )
                    }else {
                        return (
                          
                         <NavLink key={item.name}  to={item.slug} className={classNameNav}>{item.name}</NavLink>
                      
                        )

                    }
                    
})}
    </>
  )
}

export default Navigation