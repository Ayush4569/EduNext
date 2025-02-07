import { DataTable } from '@/components/ui/DataTable'
import { Button } from '../components/ui/button'
import React, { useState } from 'react'
import { columns } from '@/components/ui/Columns'
import { useEffect } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { useInstructor } from '@/context/InstructorContext'


const Teacherpage = () => {
  const [courses, setCourses] = useState([])
  const { instructor } = useInstructor()
  if (!instructor) {
    return <Navigate to="/" />;
  }
  useEffect(() => {
   const fetchCourses = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/v1/courses`,{withCredentials:true})
      if(response.statusText == 'OK' && response.data){
        setCourses(response.data.courses)
      }
    } catch (error) {
      console.log('Error fetching courses',error);  
    }
   }
   fetchCourses()
  }, [])
  
  return (
    <div className='p-6'>
    <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default Teacherpage