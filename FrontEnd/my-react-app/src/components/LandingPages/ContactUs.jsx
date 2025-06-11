import React, { useState } from 'react';
import { Mail, Send, MapPin, Clock, Phone, MessageSquare, Star, CheckCircle, Car, Shield, CreditCard } from 'lucide-react';
import Navbar from './Navbar';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login or show error message
        alert('Please login to submit the contact form');
        return;
      }

      const response = await fetch('http://localhost:9090/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: '',
          message: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again later.');
    }
  };

  const contactReasons = [
    {
      icon: Car,
      title: 'Booking Support',
      description: 'Need help with reservations, modifications, or cancellations?',
      category: 'booking'
    },
    {
      icon: CreditCard,
      title: 'Payment Issues',
      description: 'Questions about billing, refunds, or payment methods?',
      category: 'payment'
    },
    {
      icon: Shield,
      title: 'Insurance & Coverage',
      description: 'Understanding protection plans and coverage options?',
      category: 'insurance'
    },
    {
      icon: MessageSquare,
      title: 'General Inquiry',
      description: 'Any other questions or feedback about our services?',
      category: 'general'
    }
  ];

  const quickStats = [
    { icon: Clock, stat: '< 2 Hours', label: 'Average Response Time' },
    { icon: Star, stat: '4.9/5', label: 'Customer Satisfaction' },
    { icon: Mail, stat: '99.5%', label: 'Email Delivery Rate' },
    { icon: CheckCircle, stat: '24/7', label: 'Support Availability' }
  ];

  const faqItems = [
    {
      question: 'How quickly will I receive a response?',
      answer: 'We typically respond to all email inquiries within 2 hours during business hours, and within 24 hours on weekends and holidays.'
    },
    {
      question: 'What information should I include in my email?',
      answer: 'Please include your booking reference number (if applicable), contact details, and a detailed description of your inquiry for faster assistance.'
    },
    {
      question: 'Can I modify my booking via email?',
      answer: 'Yes! Send us your booking details and requested changes. We\'ll process modifications and send you an updated confirmation.'
    },
    {
      question: 'Do you offer emergency roadside assistance?',
      answer: 'Yes, we provide 24/7 roadside assistance. For emergencies, email us immediately with your location and booking details.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600/10 to-indigo-600/10">
        <Navbar />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Mail className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-4xl text-transparent block sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Have questions about your rental? Need support? We're here to help via email, 
              ensuring you get personalized assistance for all your car rental needs.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="py-12 sm:py-16 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {quickStats.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{item.stat}</div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Reasons */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How Can We Help You?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your inquiry type below to get the most relevant assistance
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {contactReasons.map((reason, index) => {
              const IconComponent = reason.icon;
              return (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-blue-200">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{reason.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{reason.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Send Us an Email</h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
              <p className="text-green-700">
                Thank you for contacting us. We'll respond to your inquiry within 2 hours during business hours.
              </p>
            </div>
          ) : (
            <form>
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Inquiry Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    <option value="booking">Booking Support</option>
                    <option value="payment">Payment Issues</option>
                    <option value="insurance">Insurance & Coverage</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Brief subject of your inquiry"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Please provide detailed information about your inquiry. Include booking reference numbers if applicable."
                ></textarea>
              </div>

              <button
              onClick={handleSubmit}
                type="submit"
                className="w-full bg-gradient-to-r from-red-400 to-red-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                Send Message
              </button>
              </div>
           </form>
          )}
        </div>
      </div>

      {/* Alternative Contact */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white text-center">
            <Mail className="w-16 h-16 mx-auto mb-6 text-white/90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Prefer Direct Email?</h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              You can also reach us directly at our dedicated support email addresses
            </p>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-semibold mb-2">General Support</h3>
                <a href="mailto:support@renteasy.com" className="text-blue-200 hover:text-white transition-colors">
                  support@renteasy.com
                </a>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-semibold mb-2">Booking Help</h3>
                <a href="mailto:bookings@renteasy.com" className="text-blue-200 hover:text-white transition-colors">
                  bookings@renteasy.com
                </a>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-semibold mb-2">Business Inquiries</h3>
                <a href="mailto:business@renteasy.com" className="text-blue-200 hover:text-white transition-colors">
                  business@renteasy.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Quick answers to common questions about contacting us
            </p>
          </div>
          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;