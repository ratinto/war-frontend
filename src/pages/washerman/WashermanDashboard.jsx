import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTshirt, FaCalendarAlt } from "react-icons/fa";
import Navbar from "./components/Navbar";
import logo from "../../assets/rishihood-logo.webp";

function WashermanDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [washermanData, setWashermanData] = useState(null);

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
      fetchOrders();
    } catch (error) {
      console.error('Error parsing washerman data:', error);
      navigate('/washerman/login');
    }
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/all/');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (response.ok) {
        // Refresh orders after successful update
        fetchOrders();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update order status");
      }
    } catch (error) {
      setError("Network error while updating order status");
      console.error('Status update error:', error);
    }
  };

  const handleReceived = (orderId) => {
    handleStatusUpdate(orderId, 'inprogress');
  };

  const handleReady = (orderId) => {
    handleStatusUpdate(orderId, 'complete');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = selectedTab === "all" ||
      (selectedTab === "pending" && order.status === "pending") ||
      (selectedTab === "inprogress" && order.status === "inprogress") ||
      (selectedTab === "complete" && order.status === "complete");
    const matchesSearch = order.bag_no.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (!washermanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a30c34]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f3] pt-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 font-['Playfair_Display']">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-900">
          Orders
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 w-full bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-center font-medium">{error}</p>
          </div>
        )}

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex flex-wrap border rounded-xl overflow-hidden bg-white shadow-sm">
            {["all", "pending", "inprogress", "complete"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium text-sm sm:text-base capitalize transition-colors ${selectedTab === tab
                    ? "bg-[#a30c34] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab === "inprogress" ? "In Progress" : tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search Bag Number"
              className="w-full border rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#a30c34] outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a30c34] mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Loading orders...</p>
          </div>
        )}

        {/* Order Cards */}
        {!loading && (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm border">
                <p className="text-gray-500 text-lg">No orders found.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row justify-between gap-4 bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition"
                >
                  {/* Order Info */}
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">
                      Bag No:{" "}
                      <span className="text-[#a30c34]">{order.bag_no}</span>
                    </p>
                    <p className="text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                      <FaTshirt className="text-gray-500" /> Clothes:{" "}
                      {order.number_of_clothes}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                      <FaCalendarAlt className="text-gray-500" /> Date:{" "}
                      <span className="text-[#a30c34]">
                        {formatDate(order.submission_date)}
                      </span>
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 sm:items-end">
                    {order.status === "pending" && (
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base transition"
                        onClick={() => handleReceived(order.id)}
                      >
                        Mark as Received
                      </button>
                    )}
                    {order.status === "inprogress" && (
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base transition"
                        onClick={() => handleReady(order.id)}
                      >
                        Mark as Ready
                      </button>
                    )}
                    {order.status === "complete" && (
                      <span className="text-green-700 font-semibold text-sm sm:text-base">
                        ✅ Ready for Pickup
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WashermanDashboard;
