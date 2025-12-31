import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Post = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/v1/post/all')
      .then((res) => {
        setPosts(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

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
          posts.map((post, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow-sm"
            >
              {/* Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-80 object-cover rounded-t-lg"
                />
              )}

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-800">
                  {post.caption}
                </p>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default Post
