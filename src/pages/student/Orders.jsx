import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        // Get studentData from localStorage (same as dashboard)
        const studentDataStr = localStorage.getItem('studentData');
        if (!studentDataStr) return;
        try {
            const student = JSON.parse(studentDataStr);
            fetchDashboardData(student.bag_no);
        } catch (error) {
            console.error('Error parsing student data:', error);
        }
    }, []);

    const fetchDashboardData = async (bagNo) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/student/dashboard/${bagNo}/`);
            if (response.ok) {
                const data = await response.json();
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        }
    };
    return (
        <div className="min-h-screen flex flex-col bg-[#faf6f3] font-['Playfair_Display']">
            <Navbar />
            <main className="flex flex-col items-center flex-1 px-3 sm:px-6 py-28 sm:py-32 w-full max-w-2xl mx-auto">
                {/* Back button for small screens */}
                <button
                    className="sm:hidden mb-4 self-start px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium shadow"
                    onClick={() => navigate('/student/dashboard')}
                >
                    &#8592; Back
                </button>
                {/* Full card for small screens */}
                <div className="w-full sm:w-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-[#333] mb-6 text-center">Your Orders</h2>
                    {dashboardData && (
                        <div className="grid grid-cols-2 gap-4 text-center w-full">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{dashboardData.total_orders}</p>
                                <p className="text-sm text-blue-800">Total Orders</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">{dashboardData.pending_orders}</p>
                                <p className="text-sm text-yellow-800">Pending</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-orange-600">{dashboardData.inprogress_orders}</p>
                                <p className="text-sm text-orange-800">In Progress</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{dashboardData.complete_orders}</p>
                                <p className="text-sm text-green-800">Completed</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Orders;
