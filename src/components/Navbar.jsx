import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  User,
  Menu,
  X,
  Home
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define navigation based on user role
  const getNavigation = () => {
    const baseNavigation = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'POS', href: '/pos', icon: ShoppingCart },
      { name: 'Sales', href: '/sales', icon: BarChart3 },
    ];

    // Add admin-only routes
    if (user?.role === 'admin') {
      baseNavigation.push(
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Users', href: '/users', icon: Users }
      );
    }

    return baseNavigation;
  };

  const navigation = getNavigation();

  return (
    <nav className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">ME</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-2xl leading-6">ME</span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">MODERN EQUIPMENT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50/80 shadow-inner border border-emerald-200/50'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-white/50'
                    }`
                  }
                >
                  <IconComponent size={18} className="flex-shrink-0" />
                  <span>{item.name}</span>
                  
                  {/* Active indicator */}
                  {({ isActive }) => isActive && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                  )}
                  
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </NavLink>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-gray-200/50">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                <User size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {user?.name || "Guest"}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role || "User"}
                </span>
              </div>
            </div>

            {/* Auth Button */}
            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <User size={16} />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:shadow-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 mt-2 py-3 z-50 animate-in slide-in-from-top-2 duration-300">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-gray-600 hover:bg-gray-50/80'
                    }`
                  }
                >
                  <IconComponent size={20} className="flex-shrink-0" />
                  <span className="font-semibold">{item.name}</span>
                  {({ isActive }) => isActive && (
                    <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </NavLink>
              );
            })}
            
            {/* Mobile user info */}
            <div className="border-t border-gray-200/50 mt-2 pt-3 mx-2">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    {user?.name || "Guest"}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {user?.role || "User"} • {user?.email || "Welcome to Modern Equipment"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}