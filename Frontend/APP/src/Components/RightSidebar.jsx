import React, { useEffect, useState } from "react";
import axios from "axios";

const RightSidebar = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("User from props:", user);


    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/${user.params._id}/profile`,
          { withCredentials: true }
        );

        if (!user?._id) {
          console.log("No user id yet");
          return;
        }

        console.log("Profile API response:", res.data);

        if (res.data?.user) {
          setUserData(res.data.user);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="hidden lg:block w-[320px]" />;
  if (!userData) return null;

  return (
    <div className="hidden lg:block w-[320px] fixed right-0 top-0 h-screen border-l bg-white px-6 py-6">
      <div className="flex items-center gap-4">
        <img
          src={userData.profilePic || "/avatar.png"}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm">{userData.username}</p>
          <p className="text-xs text-gray-500">{userData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
