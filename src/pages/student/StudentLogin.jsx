import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/rishihood-logo.webp";

function StudentLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [enrollmentNo, setEnrollmentNo] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !enrollmentNo) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/student/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    enrollment_no: enrollmentNo
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store student data in localStorage for future use
                localStorage.setItem('studentData', JSON.stringify(data.student));
                localStorage.setItem('isLoggedIn', 'true');

                // Navigate to dashboard
                navigate("/student/dashboard");
            } else {
                setError(data.error || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            setError("Network error. Please try again.");
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#faf6f3] font-['Playfair_Display']">
            {/* Header */}
            <header className="p-3.5 relative z-10">
                <img
                    src={logo}
                    alt="Rishihood University Logo"
                    className="w-28 sm:w-32 md:w-36 object-contain drop-shadow-lg"
                />
            </header>

            {/* Main Section */}
            <main className="flex flex-col items-center justify-center flex-1 text-center px-4">
                <h1 className="text-2xl sm:text-3xl font-semibold text-[#333] mb-8">
                    Login
                </h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full max-w-sm">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-md bg-[#fffdfc] focus:outline-none focus:ring-2 focus:ring-[#a30c34] text-lg"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Enter your enrollment number"
                        value={enrollmentNo}
                        onChange={(e) => setEnrollmentNo(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-md bg-[#fffdfc] focus:outline-none focus:ring-2 focus:ring-[#a30c34] text-lg"
                        required
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 bg-[#a30c34] hover:bg-[#8b092d] disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition text-lg flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Logging in...
                            </>
                        ) : (
                            "Continue"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-gray-700 text-base">
                    Don't have an account?{" "}
                    <span
                        className="text-[#c45c29] font-medium hover:underline cursor-pointer"
                        onClick={() => navigate("/student/signup1")}
                    >
                        Sign up
                    </span>
                </p>
            </main>
        </div>
    );
}

export default StudentLogin;