import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Container } from '@mui/material'

function Home() {
  return (
    <div>
        
<Container>        <Navbar/>
</Container>
        <Sidebar />
       <Outlet/>
       
      
    </div>
  )
}

export default Home
