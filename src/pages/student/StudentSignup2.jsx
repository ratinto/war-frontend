import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/rishihood-logo.webp";

function Signup2() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const [formData, setFormData] = useState({
        name: "",
        enrollment_no: "",
        bag_no: "",
        phone_no: "",
        residency_no: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.enrollment_no ||
            !formData.bag_no ||
            !formData.phone_no ||
            !formData.residency_no
        ) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/student/signup/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, ...formData }),
            });

            if (res.ok) {
                navigate("/student/login");
            } else {
                setError("Error completing signup");
            }
        } catch (err) {
            console.error(err);
            setError("Network error. Please try again.");
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

            {/* Main */}
            <main className="flex flex-col items-center justify-center flex-1 text-center px-4">
                <h1 className="text-2xl sm:text-3xl font-semibold text-[#333] mb-8">
                    Complete Your Profile
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-sm">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="px-4 py-3 border border-gray-300 rounded-md bg-[#fffdfc] focus:outline-none focus:ring-2 focus:ring-[#a30c34] text-lg"
                        required
                    />

                    <input
                        type="text"
                        name="enrollment_no"
                        placeholder="Enrollment Number"
                        value={formData.enrollment_no}
                        onChange={handleChange}
                        className="px-4 py-3 border border-gray-300 rounded-md bg-[#fffdfc] focus:outline-none focus:ring-2 focus:ring-[#a30c34] text-lg"
                        required
                    />

                    <input
                        type="text"
                        name="bag_no"
                        placeholder="Bag Number (e.g., B-558)"
                        value={formData.bag_no}
                        onChange={handleChange}
                        className="px-4 py-3 border border-gray-300 rounded-md bg-[#fffdfc] focus:outline-none focus:ring-2 focus:ring-[#a30c34] text-lg"
                        required
                    />

                    <input
                        type="tel"
                        name="phone_no"
                        placeholder="Phone Number"
                        value={formData.phone_no}
                        onChange={handleChange}
                        className="px-4 py-3 border border-gray-300 rounded-md bg-[#fffdfc] focus:outline-none focus:ring-2 focus:ring-[#a30c34] text-lg"
                        required
                    />

                    <input
                        type="text"
                        name="residency_no"
                        placeholder="Residency Number"
                        value={formData.residency_no}
                        onChange={handleChange}
                        className="px-4 py-3 border border-gray-300 rounded-md bg-[#fffdfc] focus:outline-none focus:ring-2 focus:ring-[#a30c34] text-lg"
                        required
                    />

                    {/* Error */}
                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-[#a30c34] hover:bg-[#8b092d] disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition text-lg flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Submitting...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Signup2;