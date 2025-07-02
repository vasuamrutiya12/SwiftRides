import React from 'react';
import { Car, Shield, DollarSign, Users, Award, Clock, MapPin, CreditCard } from 'lucide-react';
import Footer from './Footer';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate=useNavigate();
  const stats = [
    { number: '500+', label: 'Partner Companies', icon: Users },
    { number: '50,000+', label: 'Available Cars', icon: Car },
    { number: '2M+', label: 'Happy Customers', icon: Award },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Shield }
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Best Price Guarantee',
      description: 'We compare prices across all major rental companies to ensure you get the lowest rates available.'
    },
    {
      icon: Car,
      title: 'Vast Fleet Selection',
      description: 'From economy cars to luxury vehicles, we offer the largest selection through our network of trusted partners.'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment Processing',
      description: 'Bank-grade encryption and multiple payment options including credit cards, digital wallets, and financing.'
    },
    {
      icon: Clock,
      title: '24/7 Customer Support',
      description: 'Round-the-clock assistance for bookings, modifications, and roadside support whenever you need it.'
    },
    {
      icon: MapPin,
      title: 'Global Coverage',
      description: 'Access rental cars in over 180 countries with local pickup and drop-off locations worldwide.'
    },
    {
      icon: Shield,
      title: 'Comprehensive Insurance',
      description: 'Full coverage options and transparent policies to protect you and your rental vehicle.'
    }
  ];

  const team = [
    {
      name: 'Druman Kaneriya',
      role: 'Full Stake Developer',
      image: 'https://avatars.githubusercontent.com/u/116833054?v=4',
      link: 'https://github.com/druman12',
      description: 'A very knowledgeable person with extensive project experience, skilled in working with more than two technologies.'
    },
    {
      name: 'Vasu Amrutiya',
      role: 'Full Stake Developer',
      image: 'https://avatars.githubusercontent.com/u/175853748?v=4',
      link: 'https://github.com/vasuamrutiya12',
      description: 'A tech visionary who built our backend with proper security, ensuring seamless experiences and efficient, fast data manipulations.'
    },
   
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-red-100">
        <Navbar />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Revolutionizing
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent block sm:inline"> Car Rentals</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              We're the world's largest car rental marketplace, connecting travelers with the best vehicles 
              at unbeatable prices from hundreds of trusted rental companies worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Our Story</h2>
              <div className="space-y-4 sm:space-y-6 text-gray-600 text-base sm:text-lg leading-relaxed">
                <p>
                  Founded in 2018, RentEasy began with a simple mission: make car rentals accessible, 
                  affordable, and hassle-free for everyone. We noticed that travelers were spending 
                  hours comparing prices across different rental companies, often missing out on better deals.
                </p>
                <p>
                  Today, we've built the world's most comprehensive car rental platform, partnering with 
                  over 500 rental companies globally. Our proprietary technology instantly compares millions 
                  of vehicles to guarantee you're getting the best possible price, every time.
                </p>
                <p>
                  From weekend getaways to business trips, we've helped over 2 million customers find 
                  their perfect rental car, saving them an average of 30% compared to booking directly.
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square bg-gradient-to-br from-blue-200 to-red-200 rounded-2xl sm:rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop" 
                  alt="Modern car fleet" 
                  className="w-full h-full object-cover mix-blend-overlay"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center">
                <Car className="w-8 h-8 sm:w-16 sm:h-16 text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose RentEasy?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              We've reimagined every aspect of car rentals to deliver an exceptional experience
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-red-400 to-red-400 text-white rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Meet Our Developers</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              The visionaries behind the world's most trusted car rental platform
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 sm:mb-6">
                  <div 
                    className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden ring-4 ring-white shadow-2xl group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => window.open(member.link, '_blank')}
                    title={`Visit ${member.name}'s GitHub profile`}
                  >
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{member.role}</p>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-red-300 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Our Mission & Values</h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">🚀 Innovation First</h3>
                  <p className="text-blue-100 leading-relaxed text-sm sm:text-base">
                    We constantly innovate to make car rentals smarter, faster, and more convenient through cutting-edge technology.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">🤝 Customer Obsession</h3>
                  <p className="text-blue-100 leading-relaxed text-sm sm:text-base">
                    Every decision we make is guided by what's best for our customers, ensuring exceptional experiences every time.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">🌍 Global Accessibility</h3>
                  <p className="text-blue-100 leading-relaxed text-sm sm:text-base">
                    We believe everyone deserves access to reliable, affordable transportation, wherever their journey takes them.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center order-1 lg:order-2">
              <div className="inline-block p-6 sm:p-8 lg:p-12 bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h3>
                <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-2">
                  Join millions of satisfied customers who trust RentEasy for their car rental needs.
                </p>
                <button
                onClick={() => navigate("/login")}
                className="bg-white text-red-400 px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto">
                  Start Your Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;