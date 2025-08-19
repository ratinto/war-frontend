
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IconAlertCircle, IconPlus, IconListCheck } from "@tabler/icons-react";

const Footer = ({ isHidden = false }) => {
    const location = useLocation();
    const nav = [
        { to: "/student/incomplete", label: "Incomplete", icon: IconAlertCircle },
        { to: "/student/dashboard", label: "Home", icon: IconPlus },
        { to: "/student/completed", label: "Completed", icon: IconListCheck },
    ];

    return (
        <footer className={`md:hidden fixed bottom-0 left-0 w-full z-40 transition-transform duration-300 ${
            isHidden ? 'translate-y-full' : 'translate-y-0'
        }`}>
            <div className="bg-white border-t border-gray-100 px-4 py-2 safe-area-inset-bottom">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {nav.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="flex flex-col items-center gap-1 py-2 px-3 min-w-0 flex-1"
                            >
                                <div className={`transition-colors duration-200 ${
                                    isActive ? "text-[#a30c34]" : "text-gray-400"
                                }`}>
                                    {React.createElement(item.icon, {
                                        size: 24,
                                        strokeWidth: isActive ? 2 : 1.5,
                                    })}
                                </div>
                                <span className={`text-xs font-medium transition-colors duration-200 ${
                                    isActive ? "text-[#a30c34]" : "text-gray-400"
                                }`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </footer>
    );
};

export default Footer;