import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Search, User, Mail, Phone, Hash, MapPin, Package } from "lucide-react";

function StudentLookup() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentOrders, setStudentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
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
    } catch (error) {
      console.error('Error parsing washerman data:', error);
      navigate('/washerman/login');
    }
  }, [navigate]);

  const searchStudents = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults([]);
    setSelectedStudent(null);
    setStudentOrders([]);

    try {
      // Search through all orders to find students
      const response = await fetch('http://127.0.0.1:8000/api/orders/all/');
      if (response.ok) {
        const orders = await response.json();
        
        // Extract unique students and filter by search term
        const studentMap = new Map();
        orders.forEach(order => {
          if (!studentMap.has(order.bag_no)) {
            studentMap.set(order.bag_no, {
              bag_no: order.bag_no,
              total_orders: 0,
              latest_order: order.submission_date
            });
          }
          studentMap.get(order.bag_no).total_orders++;
          if (new Date(order.submission_date) > new Date(studentMap.get(order.bag_no).latest_order)) {
            studentMap.get(order.bag_no).latest_order = order.submission_date;
          }
        });

        // Filter students based on search term
        const filteredStudents = Array.from(studentMap.values()).filter(student =>
          student.bag_no.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(filteredStudents);
        
        if (filteredStudents.length === 0) {
          setError("No students found with the given search term");
        }
      } else {
        setError("Failed to search students");
      }
    } catch (error) {
      setError("Network error while searching students");
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewStudentDetails = async (bagNo) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/student/${bagNo}/`);
      if (response.ok) {
        const data = await response.json();
        setSelectedStudent(data.student);
        setStudentOrders(data.orders);
      } else {
        setError("Failed to fetch student details");
      }
    } catch (error) {
      setError("Network error while fetching student details");
      console.error('Student details error:', error);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

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
      <div className="max-w-6xl mx-auto p-6 font-['Playfair_Display']">
        <h1 className="text-3xl font-bold text-center mb-6">Student Lookup</h1>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Student by Bag Number
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="search"
                  type="text"
                  placeholder="Enter bag number (e.g., B-558, G-354)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a30c34]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchStudents()}
                />
              </div>
            </div>
            <button
              onClick={searchStudents}
              disabled={loading}
              className="bg-[#a30c34] hover:bg-[#8b092d] disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 w-full bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-center font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && !selectedStudent && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((student) => (
                <div
                  key={student.bag_no}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => viewStudentDetails(student.bag_no)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-[#a30c34]" />
                    <span className="font-semibold">{student.bag_no}</span>
                  </div>
                  <p className="text-sm text-gray-600">Total Orders: {student.total_orders}</p>
                  <p className="text-sm text-gray-600">Last Order: {formatDate(student.latest_order)}</p>
                  <button className="mt-2 text-[#a30c34] hover:text-[#8b092d] text-sm font-medium">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Details */}
        {selectedStudent && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Student Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Student Information</h2>
                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setStudentOrders([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Search
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedStudent.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedStudent.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Enrollment Number</p>
                    <p className="font-medium">{selectedStudent.enrollment_no}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Bag Number</p>
                    <p className="font-medium">{selectedStudent.bag_no}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{selectedStudent.phone_no}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Residency</p>
                    <p className="font-medium">{selectedStudent.residency_no}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order History</h2>
              
              {studentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders found</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {studentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">Order #{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Clothes: {order.number_of_clothes}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {formatDate(order.submission_date)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentLookup;
