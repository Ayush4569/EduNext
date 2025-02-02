import Sidebar from './sidebar'
import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Navbar from './navbar'
import { useInstructor } from '@/context/InstructorContext'
import { useStudent } from '@/context/StudentContext'
const Layout = () => {
  return (
    <div className='h-full'>
      <div className='md:pl-56 h-[80px] fixed inset-y-0 w-full z-50'>
      <Navbar/>
      </div>
        <div className=' xxs:hidden md:flex h-full w-56 flex-col fixed z-50 inset-y-0  border'>
        <Sidebar/>
        </div>
        <div className='md:pl-56 pt-[80px] w-full'>
        <Outlet/>
        </div>
    </div>
  )
}

export default Layout