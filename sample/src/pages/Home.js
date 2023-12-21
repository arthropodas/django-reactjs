import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function Home() {
  return (
    <div>
        
        <Navbar/>
        <Sidebar/>
       <Outlet/>
       
      
    </div>
  )
}

export default Home
