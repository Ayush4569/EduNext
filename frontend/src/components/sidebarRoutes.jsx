import React from 'react'
import SideBarItem from './sideBarItem'
import { Layout,Compass, List, BarChart2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const SidebarRoutes = () => {
  const {pathname} = useLocation()
    const guestRoutes = [
        {
            icon:Layout,
            href:"/",
            label:"Dashboard"
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

    const routes = pathname?.startsWith('/teacher') ? teacherRoutes : guestRoutes
  return (
    <div className='flex flex-col w-full'>
      {
        routes.map((route)=>(
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