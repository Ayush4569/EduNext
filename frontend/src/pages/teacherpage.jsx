import { Button } from '../components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const Teacherpage = () => {
  return (
    <div className='p-6'>
    <Link to='/teacher/courses/create'>
    <Button>
       Create New Course
    </Button>
    </Link>
    </div>
  )
}

export default Teacherpage