import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import logo from "../../assets/rishihood-logo.webp";

const Dashboard = () => {
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const navigate = useNavigate();
    const [selectedCount, setSelectedCount] = useState(null);
    const [customCount, setCustomCount] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const studentDataStr = localStorage.getItem('studentData');

        if (!isLoggedIn || !studentDataStr) {
            navigate('/student/login');
            return;
        }

        try {
            const student = JSON.parse(studentDataStr);
            setStudentData(student);
            fetchDashboardData(student.bag_no);
        } catch (error) {
            console.error('Error parsing student data:', error);
            navigate('/student/login');
        }
    }, [navigate]);

    const fetchDashboardData = async (bagNo) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/student/dashboard/${bagNo}/`);
            if (response.ok) {
                const data = await response.json();
                setDashboardData(data);
            } else {
                setError("Failed to fetch dashboard data");
            }
        } catch (error) {
            setError("Network error while fetching dashboard data");
            console.error('Dashboard fetch error:', error);
        }
    };

    const handleConfirm = async () => {
        const count = selectedCount || Number(customCount);
        if (!count || count <= 0) return;

        if (!studentData) {
            setError("Student data not found. Please login again.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch('http://127.0.0.1:8000/api/orders/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bag_no: studentData.bag_no,
                    number_of_clothes: count
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Reset form
                setSelectedCount(null);
                setCustomCount("");

                // Show success message
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);

                // Refresh dashboard data
                fetchDashboardData(studentData.bag_no);
            } else {
                setError(data.error || "Failed to create order");
            }
        } catch (error) {
            setError("Network error. Please try again.");
            console.error('Order creation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNumberClick = (num) => {
        setSelectedCount(num);
        setCustomCount(num);
    };

    const handleLogout = () => {
        localStorage.removeItem('studentData');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        navigate('/home');
    };

    if (!studentData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a30c34]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#faf6f3] font-['Playfair_Display'] relative">
            {/* Navbar */}
            <Navbar logo={logo} user={studentData.name} className="fixed top-0 left-0 w-full z-10 shadow-md" />

            {/* Main Content */}
            <main className="flex flex-col items-center flex-1 px-3 sm:px-6 py-28 sm:py-32 w-full max-w-2xl mx-auto relative">
                {/* View Orders Button */}
                {/* View Orders button only for large screens */}
                <button
                    className="hidden sm:block fixed right-8 top-28 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-base font-semibold z-30"
                    style={{maxWidth: '140px'}}
                    onClick={() => setShowOrdersModal(true)}
                >
                    View Orders
                </button>
                {/* Welcome Section removed as info is now in Navbar */}

                {/* Orders Modal */}
                {showOrdersModal && dashboardData && (
                    <div>
                        {/* Modal for large screens */}
                        <div className="hidden sm:flex fixed inset-0 z-40 items-center justify-center" style={{backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.35)'}}>
                            <div className="bg-white rounded-2xl shadow-2xl p-10 w-[92vw] max-w-md relative border border-gray-200 flex flex-col items-center animate-fadeIn">
                                <button
                                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                                    onClick={() => setShowOrdersModal(false)}
                                    aria-label="Close"
                                >
                                    &times;
                                </button>
                                <h3 className="text-2xl font-bold text-[#333] mb-6 text-center tracking-wide">Your Orders</h3>
                                <div className="grid grid-cols-2 gap-5 w-full text-center">
                                    <div className="bg-blue-50 p-5 rounded-lg flex flex-col items-center">
                                        <p className="text-2xl font-bold text-blue-600">{dashboardData.total_orders}</p>
                                        <p className="text-sm text-blue-800">Total Orders</p>
                                    </div>
                                    <div className="bg-yellow-50 p-5 rounded-lg flex flex-col items-center">
                                        <p className="text-2xl font-bold text-yellow-600">{dashboardData.pending_orders}</p>
                                        <p className="text-sm text-yellow-800">Pending</p>
                                    </div>
                                    <div className="bg-orange-50 p-5 rounded-lg flex flex-col items-center">
                                        <p className="text-2xl font-bold text-orange-600">{dashboardData.inprogress_orders}</p>
                                        <p className="text-sm text-orange-800">In Progress</p>
                                    </div>
                                    <div className="bg-green-50 p-5 rounded-lg flex flex-col items-center">
                                        <p className="text-2xl font-bold text-green-600">{dashboardData.complete_orders}</p>
                                        <p className="text-sm text-green-800">Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Bottom sheet for small screens */}
                        <div className="sm:hidden fixed left-0 right-0 bottom-0 z-40 flex items-end justify-center" style={{backdropFilter: 'blur(6px)', background: 'rgba(255,255,255,0.25)', marginBottom: '80px'}}>
                            <div className="bg-white rounded-t-2xl shadow-2xl p-6 w-full max-w-md mx-auto border border-gray-200 flex flex-col items-center animate-fadeIn relative">
                                <button
                                    className="absolute top-3 right-5 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                                    onClick={() => setShowOrdersModal(false)}
                                    aria-label="Close"
                                >
                                    &times;
                                </button>
                                <h3 className="text-lg font-bold text-[#333] mb-6 text-center tracking-wide">Your Orders</h3>
                                <div className="grid grid-cols-2 gap-3 w-full text-center">
                                    <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center">
                                        <p className="text-xl font-bold text-blue-600">{dashboardData.total_orders}</p>
                                        <p className="text-xs text-blue-800">Total Orders</p>
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded-lg flex flex-col items-center">
                                        <p className="text-xl font-bold text-yellow-600">{dashboardData.pending_orders}</p>
                                        <p className="text-xs text-yellow-800">Pending</p>
                                    </div>
                                    <div className="bg-orange-50 p-3 rounded-lg flex flex-col items-center">
                                        <p className="text-xl font-bold text-orange-600">{dashboardData.inprogress_orders}</p>
                                        <p className="text-xs text-orange-800">In Progress</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg flex flex-col items-center">
                                        <p className="text-xl font-bold text-green-600">{dashboardData.complete_orders}</p>
                                        <p className="text-xs text-green-800">Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Clothes Section */}
                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 flex flex-col items-center w-full">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[#333] text-center">
                        Add Clothes for Laundry
                    </h3>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 w-full bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-center font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="mb-6 w-full bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 text-center font-medium">
                                ✓ Successfully submitted clothes for laundry!
                            </p>
                        </div>
                    )}

                    {/* Custom Count Input */}
                    <input
                        type="number"
                        min="1"
                        placeholder="Enter count"
                        value={customCount}
                        onChange={(e) => {
                            setCustomCount(e.target.value);
                            setSelectedCount(null);
                        }}
                        className="mb-5 px-8 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a30c34] w-60 text-center text-lg"
                    />

                    {/* Number Buttons */}
                    <div className="grid grid-cols-5 gap-4 w-full max-w-md mb-5">
                        {[...Array(10)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center 
                                    rounded-md border text-base sm:text-lg font-semibold shadow-sm 
                                    transition-colors duration-200
                                    ${selectedCount === i + 1
                                        ? "bg-[#a30c34] text-white border-[#a30c34]"
                                        : "bg-gray-100 hover:bg-[#f9dcdc] border-gray-300"
                                    }`}
                                onClick={() => handleNumberClick(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        className="px-8 py-3 rounded-lg bg-[#a30c34] hover:bg-[#8b092d] text-white text-lg font-semibold shadow-md transition w-full sm:w-auto disabled:bg-gray-400"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                                Submitting...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>

                {/* Logout Button removed as it is now in Navbar */}
            </main>

            {/* Footer */}
            <Footer className="fixed bottom-0 left-0 w-full z-10 shadow-md" />
        </div>
    );
};

export default Dashboard;