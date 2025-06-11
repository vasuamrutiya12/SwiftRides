import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Car, Users, MessageSquare, DollarSign, Calendar, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Car, path: "/admin/dashboard" },
    { id: 'companies', label: 'Rental Companies', icon: Car, path: "/admin/rentalCompany" },
    { id: 'customers', label: 'Customers', icon: Users, path: "/admin/Customer" },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: "/admin/bookings" },
    { id: 'queries', label: 'Customer Queries', icon: MessageSquare, path: "/admin/customer/queries" },
    { id: 'revenue', label: 'Revenue', icon: DollarSign, path: "/admin/revenue" },
    { id: 'logout', label: 'LogOut', icon: LogOut, path: "/" },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Fixed Navbar with Blur Background */}
      <nav className={`fixed top-5 left-8 right-8 z-30 transition-all duration-300 rounded-2xl 
      ${
        isScrolled 
          ? 'bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg' 
          : 'bg-gradient-to-r from-white-600/90 to-white-700/90  bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16  rounded-xl ">
            {/* Logo with Enhanced Styling */}
            <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover:bg-white/30 transition-all duration-300"></div>
                <Car className="relative h-8 w-8 text-red-500 drop-shadow-lg" />
              </div>
              <div className="hidden sm:block">
                <span className="text-red-500 text-xl font-bold tracking-wide drop-shadow-md">
                  RentCorp
                </span>
                <div className="text-red-400 text-xl font-medium -mt-1">
                  Dashboard
                </div>
              </div>
              <span className="text-red-400 text-lg font-bold sm:hidden drop-shadow-md">
                RentCorp
              </span>
            </Link>

            {/* Desktop Navigation - Enhanced */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 text-red-500 shadow-lg backdrop-blur-sm"
                        : "text-black/90 hover:bg-white/10 hover:text-red-400 hover:shadow-md"
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {/* {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )} */}
                  </Link>
                );
              })}
            </div>

            {/* Medium Screen Navigation - Enhanced Icons */}
            <div className="hidden md:flex lg:hidden items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    title={item.label}
                    className={`group relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md"
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`} />
                    {isActive && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="md:hidden relative p-2.5 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all duration-300"></div>
              <Menu className="relative h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
            </button>
          </div>
        </div>
      </nav>

      {/* Add padding to body content to account for fixed navbar */}
      <div className="h-16"></div>

      {/* Enhanced Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Enhanced Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-red-600 to-red-700 shadow-2xl transform transition-all duration-300 ease-out z-50 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header with Gradient */}
        <div className="relative p-6 border-b border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                <Car className="relative h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-white text-xl font-bold tracking-wide">RentCorp</span>
                <div className="text-white/80 text-sm font-medium -mt-1">Admin Dashboard</div>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300 group"
            >
              <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>
        </div>

        {/* Enhanced Sidebar Navigation */}
        <div className="p-4 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={closeSidebar}
                className={`group relative flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                    : "text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-white/20' : 'group-hover:bg-white/10'
                }`}>
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                </div>
                <span className="font-medium text-base">{item.label}</span>
                {isActive && (
                  <div className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-red-800/50 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default Navbar;