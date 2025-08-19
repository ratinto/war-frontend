import React from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, UserCheck } from "lucide-react";
import logo from "../assets/rishihood-logo.webp";
import { FaUserGraduate, FaTshirt } from "react-icons/fa";

function HomePage() {
    const navigate = useNavigate();

    const roles = [
        {
            title: "Student",
            icon: FaUserGraduate,
            gradient: "from-blue-100 to-blue-200",
            textColor: "text-blue-900",
            route: "/student/login",
        },
        {
            title: "Washer Man",
            icon: FaTshirt,
            gradient: "from-yellow-100 to-yellow-200",
            textColor: "text-yellow-900",
            route: "/washerman/login",
        },
    ];

    return (
    <div className="min-h-screen flex flex-col font-['Playfair_Display'] relative overflow-hidden bg-[#faf6f3]">

            {/* Header */}
            <header className="p-3.5 relative z-10">
                <img
                    src={logo}
                    alt="Rishihood University Logo"
                    className="w-28 sm:w-32 md:w-36 object-contain drop-shadow-lg"
                />
            </header>
            {/* Main */}
            <main className="flex flex-col items-center justify-center flex-1 text-center px-4 relative z-10 w-full">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#333] mb-10">
                    Hey there! Who’s logging in?
                </h1>

                <div className="flex flex-col sm:flex-row gap-8 w-full justify-center items-center">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <div
                                key={role.title}
                                className={`flex flex-col items-center p-6 w-64 max-w-full rounded-2xl shadow-lg bg-gradient-to-br ${role.gradient} ${role.textColor} cursor-pointer transform hover:scale-105 hover:shadow-xl transition`}
                                onClick={() => navigate(role.route)}
                            >
                                <Icon className="text-5xl mb-3" />
                                <p className="font-medium text-lg md:text-xl">{role.title}</p>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default HomePage;