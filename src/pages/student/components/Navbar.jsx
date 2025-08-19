import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/rishihood-logo.webp";
import { Bell, User, LogOut, UserCheck, Clock, Plus, Menu, X, Home, FileText, Settings, Shield, UserCircle, Star } from "lucide-react";
import Footer from "./Footer";

function Navbar() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);
    const dropdownRef = useRef();

    const handleLogout = () => {
        // Clear all student data from localStorage
        localStorage.removeItem('studentData');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        
        // Close dropdown and navigate to home
        setIsDropdownOpen(false);
        navigate('/home');
    };

    // Service hours logic
    const getServiceStatus = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Service hours: Monday to Friday, 8:30 AM to 6:00 PM
        const isWeekday = currentDay >= 1 && currentDay <= 5;
        const afterStart = currentHour > 8 || (currentHour === 8 && currentMinute >= 30);
        const beforeEnd = currentHour < 18;
        const isServiceHours = afterStart && beforeEnd;

        return {
            isOpen: isWeekday && isServiceHours,
            status: isWeekday && isServiceHours ? "Open" : "Closed",
            color: isWeekday && isServiceHours ? "text-green-600" : "text-red-600"
        };
    };

    const serviceStatus = getServiceStatus();

    // Handle rating
    const handleRating = (selectedRating) => {
        setRating(selectedRating);
        setHasRated(true);
        // Here you can add API call to submit rating
        console.log(`Rating submitted: ${selectedRating} stars`);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-button')) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-[#faf6f3] shadow-md px-4 sm:px-6 py-3 flex items-center justify-between font-medium z-50">
                {/* Left: Logo */}
                <img
                    src={logo}
                    alt="Rishihood Logo"
                    className="w-24 sm:w-28 md:w-32 object-contain"
                />

                {/* Center: Dashboard Navigation - Desktop Only */}
                <div className="hidden lg:flex items-center space-x-6 text-gray-700 absolute left-1/2 transform -translate-x-1/2">
                    <Link
                        to="/student/incomplete"
                        className="hover:text-[#a30c34] transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium"
                    >
                        Incomplete
                    </Link>
                    <Link
                        to="/student/dashboard"
                        className="hover:text-[#a30c34] transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/student/completed"
                        className="hover:text-[#a30c34] transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium"
                    >
                        Completed
                    </Link>
                </div>

                {/* Right: Service Hours & Profile */}
                <div className="flex items-center space-x-3 sm:space-x-4 relative flex-shrink-0">
                    {/* 🕐 Service Hours Indicator - Desktop Only */}
                    <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm relative group">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${serviceStatus.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`text-xs font-medium ${serviceStatus.color}`}>
                                {serviceStatus.status}
                            </span>
                        </div>

                        {/* Hover Tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            <div className="text-center">
                                <div className="font-semibold mb-1">Laundry Hours</div>
                                <div>Monday - Saturday</div>
                                <div>8:30 AM - 6:00 PM</div>
                                <div className="text-gray-300 text-xs mt-1">Closed on Sundays</div>
                            </div>
                            {/* Arrow */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                        </div>
                    </div>

                    {/* 👤 Profile - Desktop Only */}
                    <div className="hidden lg:block relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-[#a30c34] to-[#d63384] rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="hidden sm:block text-gray-700 group-hover:text-[#a30c34] text-sm font-medium">Ritesh</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden">
                                <div className="p-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-[#a30c34] to-[#d63384] rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">Ritesh Kumar</p>
                                            <p className="text-xs text-gray-500">Student</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-1">
                                    <Link
                                        to="/student/profile"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-200"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        <span>My Profile</span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            window.open('https://forms.gle/tyKosaoDJZAGUqDA9', '_blank');
                                        }}
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-200 w-full text-left"
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>Feedback</span>
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 text-sm text-red-600 transition-colors duration-200 w-full"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden mobile-menu-button p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5 text-gray-600" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu - Full Screen Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>

                    {/* Menu Content */}
                    <div className="mobile-menu absolute top-0 right-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="font-semibold text-gray-800 text-lg">Rishihood University</h3>
                                <p className="text-xs text-gray-500">Laundry Service</p>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* User Profile Section */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#a30c34] to-[#d63384] rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-lg">Ritesh Kumar</h4>
                                    <p className="text-sm text-gray-500">Student</p>
                                    <p className="text-xs text-gray-400">2401010384</p>
                                </div>
                            </div>
                        </div>

                        {/* Service Status */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-gray-600" />
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${serviceStatus.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm font-medium ${serviceStatus.color}`}>
                                        Service: {serviceStatus.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu - Simplified */}
                        <div className="py-4">
                            {/* View Orders for small screens inside sidebar */}
                            <Link
                                to="/student/orders"
                                className="flex items-center px-6 py-4 hover:bg-gray-50 text-gray-700 transition-colors duration-200 w-full text-left sm:hidden"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="text-base font-medium">View Orders</span>
                            </Link>
                            <Link
                                to="/student/profile"
                                className="flex items-center px-6 py-4 hover:bg-gray-50 text-gray-700 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="text-base font-medium">My Profile</span>
                            </Link>

                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    window.open('https://forms.gle/tyKosaoDJZAGUqDA9', '_blank');
                                }}
                                className="flex items-center px-6 py-4 hover:bg-gray-50 text-gray-700 transition-colors duration-200 w-full text-left"
                            >
                                <span className="text-base font-medium">Feedback</span>
                            </button>
                        </div>

                        {/* Rate Us Section */}
                        <div className="px-6 py-4 border-t border-gray-100">
                            <div className="mb-3">
                                <span className="text-base font-medium text-gray-700">Rate Us</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRating(star)}
                                        className={`p-1 transition-colors duration-200 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                            } hover:text-yellow-400`}
                                    >
                                        <Star className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
                                    </button>
                                ))}
                            </div>
                            {hasRated && (
                                <p className="text-xs text-green-600 mt-2">Thank you for your rating!</p>
                            )}
                        </div>

                        {/* Sign Out Button */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Footer - pass mobile menu state */}
            <Footer isHidden={isMobileMenuOpen} />
        </>
    );
}

export default Navbar;