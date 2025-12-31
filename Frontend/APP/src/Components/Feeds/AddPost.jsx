import { useState } from "react";
import axios from "axios";

const AddPost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/post/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Post created successfully");
      console.log(res)
      setCaption("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Add New Post
        </h2>

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-64 object-cover rounded mb-4"
          />
        )}

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Image Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
