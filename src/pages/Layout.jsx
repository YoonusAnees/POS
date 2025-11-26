import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navbar with scroll effect */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50" 
          : "bg-transparent"
      }`}>
        <Navbar />
      </div>

      {/* Main content with enhanced styling */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Glass morphism content container */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/5 border border-white/50 overflow-hidden">
            {/* Dynamic accent bar based on current route */}
            <div className={`h-2 bg-gradient-to-r ${
              location.pathname.includes('/dashboard') ? 'from-blue-500 to-cyan-500' :
              location.pathname.includes('/pos') ? 'from-emerald-500 to-green-500' :
              location.pathname.includes('/products') ? 'from-purple-500 to-pink-500' :
              location.pathname.includes('/sales') ? 'from-orange-500 to-amber-500' :
              location.pathname.includes('/users') ? 'from-red-500 to-rose-500' :
              'from-gray-500 to-slate-500'
            }`}></div>
            
            {/* Content area */}
            <div className="p-6 sm:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced footer */}
      <footer className="relative bg-white/80 backdrop-blur-xl border-t border-gray-200/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">ME</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 text-lg">MODERN EQUIPMENT</span>
                <p className="text-sm text-gray-600">POS System</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              © 2024 MODERN EQUIPMENT POS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}