import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/rishihood-logo.webp";

function LaunchPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-['Playfair_Display'] relative overflow-hidden bg-[#faf6f3]">

      {/* Logo */}
      <header className="p-3.5 relative z-10">
        <img
          src={logo}
          alt="Rishihood University Logo"
          className="w-28 sm:w-32 md:w-36 object-contain drop-shadow-lg"
        />
      </header>

      {/* Main Card */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-4 relative z-10 w-full">
        <div className="backdrop-blur-md bg-white/40 border border-white/30 rounded-2xl shadow-xl px-8 py-10 max-w-lg mx-auto animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#a30c34] mb-4">
            Welcome!
          </h1>
          <p className="text-lg md:text-xl text-[#333] mb-6 font-bold">
            Rishihood University Laundry Service
          </p>
          <button
            onClick={() => navigate("/home")}
            className="bg-[#a30c34] hover:bg-[#8b092d] text-white px-8 py-3 text-lg rounded-lg shadow transition font-semibold"
          >
            Continue
          </button>
        </div>
      </main>
      {/* Animation style */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 1.2s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

export default LaunchPage;