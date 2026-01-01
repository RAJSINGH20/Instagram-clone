import axios from 'axios';
import React from 'react';

const RightSidebar = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/${user.id}/profile`, { withCredentials: true });
        const data = await response.data;
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  // Show a ghost/loading state while fetching
  if (loading) return <div className="hidden lg:block w-[350px] sticky top-0 h-screen bg-white border-l p-6 animate-pulse" />;

  return (
    <div className="hidden lg:block w-[350px] sticky top-0 h-screen bg-white border-l px-6 py-6 overflow-y-auto">
      
      {/* 1. User Profile Section */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={user?.profilePic || "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="overflow-hidden">
            <h2 className="font-bold text-gray-900 truncate">{user?.username || "Guest User"}</h2>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-semibold transition-colors">
          View Profile
        </button>
      </div>

      {/* 2. Trends / Suggested Section (Static UI for layout) */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-gray-800 px-1">Who to follow</h3>
        
        <div className="space-y-4">
          {/* Mock Suggestion 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-500">JS</div>
              <div>
                <p className="text-sm font-bold text-gray-900">JavaScript Guru</p>
                <p className="text-xs text-gray-500">@js_master</p>
              </div>
            </div>
            <button className="text-xs bg-black text-white px-4 py-1.5 rounded-full font-bold hover:bg-gray-800">
              Follow
            </button>
          </div>

          {/* Mock Suggestion 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-500">RE</div>
              <div>
                <p className="text-sm font-bold text-gray-900">React Enthusiast</p>
                <p className="text-xs text-gray-500">@react_dev</p>
              </div>
            </div>
            <button className="text-xs bg-black text-white px-4 py-1.5 rounded-full font-bold hover:bg-gray-800">
              Follow
            </button>
          </div>
        </div>
        
        <button className="mt-4 text-sm text-blue-500 hover:underline px-1">
          Show more
        </button>
      </div>

      {/* 3. Footer Links */}
      <div className="mt-6 px-4 flex flex-wrap gap-x-3 gap-y-1">
        <span className="text-xs text-gray-400 hover:underline cursor-pointer">Terms of Service</span>
        <span className="text-xs text-gray-400 hover:underline cursor-pointer">Privacy Policy</span>
        <span className="text-xs text-gray-400">© 2026 YourApp Inc.</span>
      </div>
    </div>
  );
};

export default RightSidebar;