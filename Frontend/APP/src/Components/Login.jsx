import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [loading, Setloading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            navigate("/");
            Setloading(true);
            const res = await axios.post("http://localhost:8000/api/v1/user/login", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message || "Login successful");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            Setloading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Login Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">



                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Button */}
                    {
                        loading ? (<div className="mt-4 text-center text-blue-600">Logging in...</div>) : (<button
                            type="submit"
                            className="w-full border-2 border-blue-600 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-all duration-200 ease-in-out active:scale-95"
                        >
                            Login
                        </button>
                        )}
                </form>


                <p className="text-sm text-center mt-4">
                    dont have an account?{" "}
                    <span className="text-blue-600 cursor-pointer hover:underline">
                        <Link to="/signup">Signup</Link>
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login