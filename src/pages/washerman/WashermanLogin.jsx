import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/rishihood-logo.webp";

function WashermanLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/washerman/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store washerman data in localStorage for future use
                localStorage.setItem('washermanData', JSON.stringify(data.washerman));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userType', 'washerman');

                // Navigate to dashboard
                navigate("/washerman/dashboard");
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
            <header className="p-6">
                <img
                    src={logo}
                    alt="Rishihood University Logo"
                    className="w-28 sm:w-32 md:w-36 object-contain"
                />
            </header>

            {/* Main Section */}
            <main className="flex flex-col items-center justify-center flex-1 text-center px-4">
                <h1 className="text-2xl sm:text-3xl font-semibold text-[#333] mb-8">
                    Login
                </h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-md bg-[#fffdfc] focus:outline-none focus:ring-2 focus:ring-[#a30c34] text-lg"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
            </main>
        </div>
    );
}

export default WashermanLogin; 