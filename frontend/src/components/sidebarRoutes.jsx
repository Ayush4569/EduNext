import React from 'react'
import SideBarItem from './SideBarItem'
import { Layout,Compass, List, BarChart2 } from 'lucide-react'
import { useInstructor } from '@/context/InstructorContext'
import { useStudent } from '@/context/StudentContext'

const SidebarRoutes = () => {
  const {instructor} = useInstructor()
  const {student} = useStudent()
    const studentRoutes = [
        {
            icon:Layout,
            href:"/dashboard",
            label:"My Courses"
        },
        {
            icon:Compass,
            href:"/search",
            label:"Browse"
        },
    ]
    const teacherRoutes = [
        {
            icon:List,
            href:"/teacher/courses",
            label:"Courses"
        },
        {
            icon:BarChart2,
            href:"/teacher/analytics",
            label:"Analytics"
        },
    ]

 
    const routes = instructor ? teacherRoutes : student ? studentRoutes : null

  return (
    <div className='flex flex-col w-full'>
      {
        routes?.map((route)=>(
            <SideBarItem
             key={route.href}
             icon={route.icon}
             label={route.label}
             href={route.href}
             
            />
        ))
      }
    </div>
  )
}

export default SidebarRoutes