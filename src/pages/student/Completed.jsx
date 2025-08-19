import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import logo from "../../assets/rishihood-logo.webp";

const Completed = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
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
            fetchCompletedOrders(student.bag_no);
        } catch (error) {
            console.error('Error parsing student data:', error);
            navigate('/student/login');
        }
    }, [navigate]);

    const fetchCompletedOrders = async (bagNo) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/orders/student/${bagNo}/`);
            if (response.ok) {
                const data = await response.json();
                // Filter only completed orders
                const completed = data.orders.filter(order => order.status === 'complete');
                setCompletedOrders(completed);
            } else {
                setError("Failed to fetch orders");
            }
        } catch (error) {
            setError("Network error while fetching orders");
            console.error('Orders fetch error:', error);
        } finally {
            setLoading(false);
        }
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
            <Navbar logo={logo} user={studentData.name} className="fixed top-0 left-0 w-full z-10 shadow-md" />

            <main className="flex flex-col flex-1 px-4 sm:px-6 py-24 sm:py-28 w-full max-w-2xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#a30c34] mb-8 text-center">Completed Orders</h1>

                {/* Orders Section */}
                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 w-full bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-center font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a30c34] mx-auto mb-4"></div>
                            <p className="text-gray-500 text-lg">Loading completed orders...</p>
                        </div>
                    )}

                    {/* Orders List */}
                    {!loading && (
                        <>
                            {completedOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">No completed orders yet</p>
                                    <p className="text-gray-400 text-sm mt-2">Your completed laundry orders will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {completedOrders.map((order) => (
                                        <div key={order.id} className="border border-green-200 bg-green-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-800">Order #{order.id}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Submitted: {new Date(order.submission_date).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Completed: {new Date(order.updated_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-green-600">{order.number_of_clothes} clothes</p>
                                                    <div className="flex items-center space-x-1 mt-1">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm text-green-600 font-medium">Completed</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

        </div>
    );
};

export default Completed;