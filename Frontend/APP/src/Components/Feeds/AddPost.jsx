import { useState } from "react";
import axios from "axios";

const AddPost = () => {
  const [caption, setCaption] = useState(" my caption");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
    console.log('token', localStorage.getItem("token"))

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8000/api/v1/post/add",
        formData,
        {
          withCredentials: true, // cookie automatically sent
        }
      );

      setCaption("");
      setImage(null);
      setPreview(null);
      alert("Posted!");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-md border rounded-lg shadow-sm">

        {/* Header */}
        <div className="border-b px-4 py-3 text-center font-semibold">
          Create new post
        </div>

        {/* Image Preview */}
        <div className="flex items-center justify-center bg-gray-100 h-80">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <label className="flex flex-col items-center text-gray-500 cursor-pointer">
              <span className="text-sm">Drag photos here</span>
              <span className="text-xs mt-1 text-blue-500 font-semibold">
                Select from computer
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Caption */}
        <div className="p-4 border-t">
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full resize-none text-sm outline-none"
            rows={3}
          />
        </div>

        {/* Post Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full border-t py-3 text-blue-500 font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Sharing..." : "Share"}
        </button>
      </div>
    </div>
  );
};

export default AddPost;
