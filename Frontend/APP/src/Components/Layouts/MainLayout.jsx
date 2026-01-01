import React from 'react'
import Sidebar from '../Sidebar.jsx'
import Feeds from '../Feeds/Feeds.jsx'
import RightSidebar from '../RightSidebar.jsx'

const MainLayout = () => {
  return (
    // 1. Center the entire app on ultra-wide screens using max-w-[1440px]
    <div className="flex justify-center min-h-screen bg-white">
      
      <div className="flex w-full max-w-[1440px]">
        
        {/* LEFT SIDEBAR: 
            - Hidden on mobile/small tablets 
            - Visible from 'sm' (640px) up
            - Fixed width on large screens
        */}
        <div className="hidden sm:block w-20 xl:w-64 shrink-0 border-r">
          <Sidebar />
        </div>

        {/* MAIN FEED: 
            - 'flex-1' makes it take all available middle space
            - Added max-width to keep posts from getting too wide/stretched
        */}
        <main className="flex-1 flex justify-center overflow-y-auto border-r min-w-0">
          <div className="w-full max-w-[600px] p-4">
             <Feeds />
          </div>
        </main>

        {/* RIGHT SIDEBAR: 
            - Hidden on everything except large desktops (lg: 1024px+)
            - Adjusts width dynamically
        */}
        <aside className="hidden lg:block w-[300px] xl:w-[350px] shrink-0">
          <RightSidebar />
        </aside>

      </div>
    </div>
  )
}

export default MainLayout