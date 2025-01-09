import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
const Navbarroutes = () => {
    const location = useLocation()
    const isTeacher = location.pathname.startsWith('/teacher');
    const isStudent = location.pathname.includes('/chapter')
  return (
    <div className='flex gap-x-4 items-center ml-auto'>
      {
        isTeacher || isStudent ? (
            <Link to='/' >
            <Button variant='outline'>
                <LogOut className='h-4 w-4 mr-2'/>
                Exit
            </Button>
            </Link>
        ) : (
            <Link to='/teacher/courses'>
            <Button variant='outline'> 
                Teacher Mode
            </Button>
            </Link>
        )
      }
        <div>
        <FontAwesomeIcon icon={faUser} className='h-5' />
        </div>
    </div>
  )
}

export default Navbarroutes