import axios from "axios";
import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/post/all", {withCredentials: true})
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.error(err));
  }, []);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-xl space-y-6">

        <h2 className="text-xl font-semibold text-gray-800">
          Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            No posts found
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white border rounded-lg shadow-sm"
            >
              {/* 🔹 Header (User Profile) */}
              <div className="flex items-center gap-3 px-4 py-3">
                <img
                  src={post.author?.profilePic || "/avatar.png"}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-semibold text-sm">
                  {post.author?.username}
                </span>
              </div>

              {/* 🔹 Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-80 object-cover"
                />
              )}

              {/* 🔹 Actions */}
              <div className="flex items-center gap-4 px-4 py-3">
                <Heart
                  onClick={() => toggleLike(post._id)}
                  className={`cursor-pointer ${
                    likedPosts[post._id]
                      ? "fill-red-500 text-red-500"
                      : "text-gray-700"
                  }`}
                />
                <MessageCircle className="cursor-pointer text-gray-700" />
                <Send className="cursor-pointer text-gray-700" />
              </div>

              {/* 🔹 Caption */}
              <div className="px-4 pb-4 text-sm">
                <span className="font-semibold mr-2">
                  {post.author?.username}
                </span>
                {post.caption}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Post;
