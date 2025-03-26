"use client"
import React, { useState } from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'
import { CourseCountContext } from '../_context/CourseCountContext'

function DashboardLayout({children}) {
    const [totalCourse,setTotalCourse]=useState(0);
  return (
    <CourseCountContext.Provider value={{totalCourse,setTotalCourse}}>
    <div>
        <div className='w-full md:w-64 fixed top-0 left-0 md:left-auto md:top-auto'>
            <SideBar/>
        </div>
        <div className='md:ml-64'>
            <div className='p-10'>
                {children}
            </div>
        </div>
        </div>
     </CourseCountContext.Provider>
  )
}

export default DashboardLayout