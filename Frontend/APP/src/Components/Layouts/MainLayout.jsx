import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar.jsx'
import Feeds from '../Feeds/Feeds.jsx'
import RightSidebar from '../RightSidebar.jsx'

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        <Feeds />
      </div>
      <div className="w-64 shrink-0">
        <RightSidebar />
      </div>

    </div>
  )
}

export default MainLayout
