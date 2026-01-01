import axios from "axios";
import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});


  // 🔹 Fetch posts
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/post/all", { withCredentials: true })
      .then((res) => {
        setPosts(res.data.posts);
        
        const likesMap = {};
        res.data.posts.forEach((post) => {
          likesMap[post._id] = post.isLiked; // backend must send this
        });
        setLikedPosts(likesMap);
      })
      .catch((err) => console.error(err));
  }, []);

  // ❤️ Like / Dislike
  const toggleLike = async (postId) => {
    try {
      const isLiked = likedPosts[postId];

      const res = await axios.put(
        `http://localhost:8000/api/v1/post/${postId}/${isLiked ? "dislike" : "like"}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: !isLiked,
        }));

        // update like count safely
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likesCount: isLiked
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("LIKE ERROR:", error.response?.data || error);
    }
  };

  // 💬 Add Comment (FIXED FIELD NAME)
  const addComment = async (postId) => {
    try {
      if (!comments[postId]?.trim()) return;

      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${postId}/comment`,
        { comment: comments[postId] }, // ✅ MUST be "comment"
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        setComments((prev) => ({
          ...prev,
          [postId]: "",
        }));
      }
    } catch (error) {
      console.error("COMMENT ERROR:", error.response?.data || error);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-md space-y-6">
        
        {posts.map((post) => (
          <div key={post._id} className="bg-white border rounded-lg">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <img
                src={post.author?.profilePic || "/avatar.png"}
                className="w-8 h-8 rounded-full object-cover"
                alt=""
              />
              <span className="font-semibold text-sm">
                {post.author?.username}
              </span>
            </div>

            {/* Image */}
            {post.image && (
              <img
                src={post.image}
                className="w-full max-h-[450px] object-cover"
                alt=""
              />
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 px-4 py-2">
              <Heart
                onClick={() => toggleLike(post._id)}
                className={`cursor-pointer ${
                  likedPosts[post._id]
                    ? "fill-red-500 text-red-500"
                    : "text-gray-800"
                }`}
              />
              <MessageCircle className="text-gray-800" />
              <Send className="ml-auto text-gray-800" />
            </div>

            {/* Likes */}
            <div className="px-4 text-sm font-semibold">
              {post.likesCount || 0} likes
            </div>

            {/* Caption */}
            <div className="px-4 py-1 text-sm">
              <span className="font-semibold mr-2">
                {post.author?.username}
              </span>
              {post.caption}
            </div>

            {/* Comment input */}
            <div className="flex items-center border-t px-4 py-2">
              <input
                type="text"
                placeholder="Add a comment…"
                className="flex-1 text-sm outline-none"
                value={comments[post._id] || ""}
                onChange={(e) =>
                  setComments({
                    ...comments,
                    [post._id]: e.target.value,
                  })
                }
              />
              <button
                onClick={() => addComment(post._id)}
                className="text-blue-500 text-sm font-semibold"
              >
                Post
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Post;
