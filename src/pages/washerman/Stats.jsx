import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { BarChart3, TrendingUp, Clock, CheckCircle, Package, Activity } from "lucide-react";
import logo from "../../assets/rishihood-logo.webp";

function Stats() {
    const navigate = useNavigate();
    const [washermanData, setWashermanData] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userType = localStorage.getItem('userType');
        const washermanDataStr = localStorage.getItem('washermanData');
        
        if (!isLoggedIn || userType !== 'washerman' || !washermanDataStr) {
            navigate('/washerman/login');
            return;
        }

        try {
            const washerman = JSON.parse(washermanDataStr);
            setWashermanData(washerman);
            fetchStatsData();
            fetchRecentOrders();
        } catch (error) {
            console.error('Error parsing washerman data:', error);
            navigate('/washerman/login');
        }
    }, [navigate]);

    const fetchStatsData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/washerman/dashboard/');
            if (response.ok) {
                const data = await response.json();
                setStatsData(data);
            } else {
                setError("Failed to fetch statistics");
            }
        } catch (error) {
            setError("Network error while fetching statistics");
            console.error('Stats fetch error:', error);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/orders/all/');
            if (response.ok) {
                const data = await response.json();
                // Get last 10 orders for recent activity
                setRecentOrders(data.slice(0, 10));
            } else {
                setError("Failed to fetch recent orders");
            }
        } catch (error) {
            setError("Network error while fetching recent orders");
            console.error('Recent orders fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'inprogress':
                return 'text-orange-600 bg-orange-100';
            case 'complete':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'inprogress':
                return 'In Progress';
            case 'complete':
                return 'Completed';
            default:
                return status;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('washermanData');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        navigate('/home');
    };

    if (!washermanData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a30c34]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#faf6f3] font-['Playfair_Display'] relative">
            {/* Navbar */}
            <Navbar logo={logo} user={washermanData.username} className="fixed top-0 left-0 w-full z-10 shadow-md" />

            {/* Main Content */}
            <main className="flex flex-col flex-1 px-4 sm:px-6 py-24 sm:py-28 w-full max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-6 text-center">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#333] mb-2">
                        Washerman Statistics
                    </h1>
                    <p className="text-gray-600">Performance Overview & Analytics</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 w-full bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-center font-medium">
                            {error}
                        </p>
                    </div>
                )}

                {/* Statistics Cards */}
                {statsData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-blue-600 mb-2">{statsData.total_orders}</h3>
                            <p className="text-gray-600">Total Orders</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-yellow-600 mb-2">{statsData.pending_orders}</h3>
                            <p className="text-gray-600">Pending Orders</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Activity className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-orange-600 mb-2">{statsData.inprogress_orders}</h3>
                            <p className="text-gray-600">In Progress</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-600 mb-2">{statsData.complete_orders}</h3>
                            <p className="text-gray-600">Completed</p>
                        </div>
                    </div>
                )}

                {/* Performance Metrics */}
                {statsData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Completion Rate */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-[#333] mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                                Completion Rate
                            </h3>
                            {statsData.total_orders > 0 ? (
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {Math.round((statsData.complete_orders / statsData.total_orders) * 100)}%
                                    </div>
                                    <p className="text-gray-600">
                                        {statsData.complete_orders} out of {statsData.total_orders} orders completed
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center">No orders yet</p>
                            )}
                        </div>

                        {/* Efficiency Metrics */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-[#333] mb-4 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                                Workload Distribution
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Pending</span>
                                    <span className="font-semibold">{statsData.pending_orders}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">In Progress</span>
                                    <span className="font-semibold">{statsData.inprogress_orders}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Completed</span>
                                    <span className="font-semibold">{statsData.complete_orders}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                    <h3 className="text-lg font-semibold text-[#333] mb-6 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-[#a30c34]" />
                        Recent Activity
                    </h3>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a30c34] mx-auto mb-4"></div>
                            <p className="text-gray-500 text-lg">Loading recent activity...</p>
                        </div>
                    )}

                    {/* Recent Orders */}
                    {!loading && (
                        <>
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-lg">No recent activity</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-800">Order #{order.id}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Bag: {order.bag_no} • {order.number_of_clothes} clothes
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Submitted: {new Date(order.submission_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="mt-6 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition self-center"
                >
                    Logout
                </button>
            </main>

            {/* Footer */}
            <Footer className="fixed bottom-0 left-0 w-full z-10 shadow-md" />
        </div>
    );
}

export default Stats;
