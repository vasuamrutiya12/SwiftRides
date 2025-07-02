import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Car, Shield, FileText, Clock, AlertTriangle, CheckCircle, Users, Eye } from 'lucide-react';
import Navbar from './Navbar';

export default function CarRentalPolicies() {
  const [activeSection, setActiveSection] = useState('terms');
  const [expandedSections, setExpandedSections] = useState({});
  const navigate=useNavigate();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const ExpandableSection = ({ id, title, icon: Icon, children }) => (
    <div className="border border-red-200 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50 flex items-center justify-between hover:from-red-100 hover:to-pink-100 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 text-red-600" />
          <span className="font-semibold text-red-800">{title}</span>
        </div>
        {expandedSections[id] ? 
          <ChevronUp className="h-5 w-5 text-red-600" /> : 
          <ChevronDown className="h-5 w-5 text-red-600" />
        }
      </button>
      {expandedSections[id] && (
        <div className="px-6 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <Car className="h-8 w-8 text-red-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              DriveConnect Policies
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted multi-vendor car rental platform with verified RC book and licensing system
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-red-100">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveSection('terms')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeSection === 'terms'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveSection('cancellation')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeSection === 'cancellation'
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                Cancellation Policy
              </button>
            </div>
          </div>
        </div>

        {/* Terms of Service Content */}
        {activeSection === 'terms' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <FileText className="h-8 w-8 mr-3" />
                  Terms of Service
                </h2>
                <p className="text-red-100 mt-2">Last updated: June 2025</p>
              </div>

              <div className="p-8">
                <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-red-800 mb-3">Platform Overview</h3>
                  <p className="text-red-700 leading-relaxed">
                    DriveConnect is a comprehensive multi-vendor car rental platform that connects customers with verified car rental providers. Our system ensures safety and reliability through mandatory RC book verification for all listed vehicles and driving license verification for all customers before booking confirmation.
                  </p>
                </div>

                <ExpandableSection id="acceptance" title="Acceptance of Terms" icon={CheckCircle}>
                  <div className="space-y-4 text-gray-700">
                    <p>By accessing and using DriveConnect, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
                    <p>These terms apply to all users including customers, vendors, and visitors to our platform. Your continued use of our services constitutes acceptance of any modifications to these terms.</p>
                    <p className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <strong>Important:</strong> You must be at least 21 years old and possess a valid driving license to rent vehicles through our platform.
                    </p>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="platform-services" title="Platform Services" icon={Car}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Multi-Vendor Marketplace</h4>
                    <p>DriveConnect operates as a marketplace connecting customers with multiple verified car rental vendors. We facilitate bookings but do not own the vehicles listed on our platform.</p>
                    
                    <h4 className="font-semibold text-red-800">Vehicle Verification System</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>All vehicles must be registered with valid RC (Registration Certificate) books</li>
                      <li>Vendors cannot list vehicles without uploading RC book documentation</li>
                      <li>Our admin team verifies all RC book submissions before approval</li>
                      <li>Regular compliance checks ensure ongoing validity of vehicle registrations</li>
                    </ul>

                    <h4 className="font-semibold text-red-800">Customer Verification Process</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Valid driving license required for all bookings</li>
                      <li>License verification completed before booking confirmation</li>
                      <li>Identity verification through government-issued documents</li>
                      <li>Background verification for premium vehicle categories</li>
                    </ul>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="user-responsibilities" title="User Responsibilities" icon={Users}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Customer Responsibilities</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide accurate and current personal information</li>
                      <li>Maintain valid driving license throughout rental period</li>
                      <li>Inspect vehicle thoroughly before and after rental</li>
                      <li>Report any damages or issues immediately</li>
                      <li>Follow all traffic laws and regulations</li>
                      <li>Return vehicle in same condition as received</li>
                      <li>Pay all fines, tolls, and parking fees incurred during rental</li>
                    </ul>

                    <h4 className="font-semibold text-red-800">Vendor Responsibilities</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Maintain valid RC book and insurance for all listed vehicles</li>
                      <li>Ensure vehicles are in good working condition</li>
                      <li>Provide accurate vehicle descriptions and photos</li>
                      <li>Honor confirmed bookings and pricing</li>
                      <li>Comply with all local regulations and licensing requirements</li>
                      <li>Maintain professional service standards</li>
                    </ul>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="booking-process" title="Booking Process & Requirements" icon={Clock}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Pre-Booking Requirements</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <p><strong>Mandatory Documents:</strong></p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Valid driving license (minimum 1 year old)</li>
                        <li>Government-issued photo ID</li>
                        <li>Proof of address</li>
                        <li>Valid credit/debit card for security deposit</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold text-red-800">Booking Confirmation Process</h4>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Select vehicle and rental period</li>
                      <li>Upload required documents for verification</li>
                      <li>Admin verification of driving license (1-2 hours)</li>
                      <li>Payment processing and security deposit hold</li>
                      <li>Booking confirmation and vehicle pickup details</li>
                    </ol>

                    <h4 className="font-semibold text-red-800">Pickup and Return</h4>
                    <p>Vehicle pickup requires physical presence of the primary renter with original documents. Return inspections are conducted to assess vehicle condition and determine any additional charges.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="payment-security" title="Payment & Security Deposits" icon={Shield}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Payment Structure</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Rental fees payable in advance</li>
                      <li>Security deposit held on credit/debit card</li>
                      <li>Additional charges for damages, fines, or violations</li>
                      <li>Fuel charges if returned with less fuel than pickup</li>
                    </ul>

                    <h4 className="font-semibold text-red-800">Security Deposit Policy</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p><strong>Security deposits vary by vehicle category:</strong></p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Economy cars: ₹5,000 - ₹10,000</li>
                        <li>Premium cars: ₹15,000 - ₹25,000</li>
                        <li>Luxury vehicles: ₹30,000 - ₹50,000</li>
                        <li>Commercial vehicles: ₹20,000 - ₹40,000</li>
                      </ul>
                    </div>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="liability-insurance" title="Liability & Insurance" icon={Shield}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Insurance Coverage</h4>
                    <p>All vehicles listed on our platform must maintain comprehensive insurance coverage. However, customers are responsible for any damages not covered by the vendor's insurance policy.</p>

                    <h4 className="font-semibold text-red-800">Liability Limitations</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>DriveConnect acts as a facilitator and is not liable for vehicle condition or vendor actions</li>
                      <li>Customers assume full responsibility for vehicle operation and any resulting damages</li>
                      <li>Personal injury or property damage claims are subject to applicable insurance coverage</li>
                      <li>Traffic violations and legal issues are the customer's responsibility</li>
                    </ul>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="prohibited-uses" title="Prohibited Uses" icon={AlertTriangle}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Strictly Prohibited Activities</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Using vehicles for illegal activities or purposes</li>
                      <li>Subletting or transferring rental to unauthorized persons</li>
                      <li>Racing, rallying, or competitive driving events</li>
                      <li>Driving under influence of alcohol or drugs</li>
                      <li>Transporting hazardous or prohibited materials</li>
                      <li>Off-road driving unless specifically permitted</li>
                      <li>Exceeding vehicle passenger or weight limits</li>
                      <li>Smoking in vehicles (where prohibited)</li>
                    </ul>

                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <p><strong>Violation Consequences:</strong> Immediate rental termination, security deposit forfeiture, legal action, and permanent platform ban.</p>
                    </div>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="dispute-resolution" title="Dispute Resolution" icon={Eye}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Dispute Handling Process</h4>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Initial dispute reporting through platform support</li>
                      <li>Documentation and evidence collection</li>
                      <li>Mediation between parties facilitated by DriveConnect</li>
                      <li>Escalation to legal arbitration if unresolved</li>
                    </ol>

                    <h4 className="font-semibold text-red-800">Jurisdiction and Governing Law</h4>
                    <p>These terms are governed by Indian law, and any disputes shall be subject to the jurisdiction of courts in [Your City], India.</p>
                  </div>
                </ExpandableSection>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Policy Content */}
        {activeSection === 'cancellation' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Clock className="h-8 w-8 mr-3" />
                  Cancellation Policy
                </h2>
                <p className="text-red-100 mt-2">Flexible cancellation options for your convenience</p>
              </div>

              <div className="p-8">
                <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-red-800 mb-3">Cancellation Overview</h3>
                  <p className="text-red-700 leading-relaxed">
                    We understand that plans can change. Our cancellation policy is designed to be fair to both customers and vendors while maintaining platform integrity. Cancellation fees vary based on timing and booking type.
                  </p>
                </div>

                <ExpandableSection id="customer-cancellation" title="Customer Cancellation Policy" icon={Users}>
                  <div className="space-y-6 text-gray-700">
                    <h4 className="font-semibold text-red-800">Cancellation Timeline & Charges</h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                        <h5 className="font-semibold text-green-800">Free Cancellation</h5>
                        <p className="text-sm text-green-700 mt-1">More than 24 hours before pickup</p>
                        <p className="text-lg font-bold text-green-800 mt-2">0% charge</p>
                        <p className="text-sm text-green-600 mt-1">Full refund processed within 3-5 business days</p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                        <h5 className="font-semibold text-yellow-800">Standard Cancellation</h5>
                        <p className="text-sm text-yellow-700 mt-1">12-24 hours before pickup</p>
                        <p className="text-lg font-bold text-yellow-800 mt-2">25% charge</p>
                        <p className="text-sm text-yellow-600 mt-1">75% refund after deducting processing fees</p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                        <h5 className="font-semibold text-orange-800">Late Cancellation</h5>
                        <p className="text-sm text-orange-700 mt-1">6-12 hours before pickup</p>
                        <p className="text-lg font-bold text-orange-800 mt-2">50% charge</p>
                        <p className="text-sm text-orange-600 mt-1">50% refund after deducting processing fees</p>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                        <h5 className="font-semibold text-red-800">No-Show/Last Hour</h5>
                        <p className="text-sm text-red-700 mt-1">Less than 6 hours or no-show</p>
                        <p className="text-lg font-bold text-red-800 mt-2">100% charge</p>
                        <p className="text-sm text-red-600 mt-1">No refund available</p>
                      </div>
                    </div>

                    <h4 className="font-semibold text-red-800">Special Circumstances</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p><strong>Emergency Cancellations:</strong></p>
                      <p className="text-sm mt-1">Medical emergencies, natural disasters, or government restrictions may qualify for special consideration. Documentation required for review.</p>
                    </div>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="vendor-cancellation" title="Vendor Cancellation Policy" icon={Car}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Vendor Cancellation Rules</h4>
                    <p>Vendors are expected to honor all confirmed bookings. Cancellations by vendors are strictly regulated to protect customer interests.</p>

                    <h4 className="font-semibold text-red-800">Permissible Vendor Cancellations</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Vehicle breakdown or accident requiring repairs</li>
                      <li>Force majeure events (natural disasters, government orders)</li>
                      <li>Customer fails document verification</li>
                      <li>Safety or security concerns</li>
                    </ul>

                    <h4 className="font-semibold text-red-800">Vendor Cancellation Penalties</h4>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Penalty fee: ₹500 - ₹2,000 based on booking value</li>
                        <li>Customer compensation: 10-20% of booking amount</li>
                        <li>Platform rating impact and review visibility</li>
                        <li>Repeated cancellations may result in account suspension</li>
                      </ul>
                    </div>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="modification-policy" title="Booking Modification Policy" icon={FileText}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Allowed Modifications</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Rental duration extension (subject to availability)</li>
                      <li>Pickup time changes (minimum 2 hours notice)</li>
                      <li>Additional driver inclusion (with valid license)</li>
                      <li>Accessories or add-on services</li>
                    </ul>

                    <h4 className="font-semibold text-red-800">Modification Charges</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold">Free Modifications</h5>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• Pickup time change (2+ hours notice)</li>
                          <li>• Duration extension (same rate)</li>
                          <li>• Add-on services</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold">Paid Modifications</h5>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• Vehicle upgrade: Price difference</li>
                          <li>• Last-minute changes: ₹200 fee</li>
                          <li>• Additional driver: ₹500/day</li>
                        </ul>
                      </div>
                    </div>

                    <h4 className="font-semibold text-red-800">Restrictions</h4>
                    <p>Vehicle category changes and pickup location changes are not permitted after booking confirmation and require cancellation and rebooking.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="refund-process" title="Refund Process & Timeline" icon={Clock}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Refund Processing Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Credit/Debit Card</span>
                        <span className="font-semibold text-red-600">3-7 business days</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Net Banking</span>
                        <span className="font-semibold text-red-600">2-5 business days</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Digital Wallets</span>
                        <span className="font-semibold text-red-600">1-3 business days</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>UPI Payments</span>
                        <span className="font-semibold text-red-600">Instant to 24 hours</span>
                      </div>
                    </div>

                    <h4 className="font-semibold text-red-800">Refund Calculation</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <p><strong>Refund Amount = </strong>Total Booking Amount - Cancellation Charges - Platform Fees - Taxes (if applicable)</p>
                      <p className="text-sm mt-2">Security deposits are released separately within 7-10 business days after vehicle return inspection.</p>
                    </div>

                    <h4 className="font-semibold text-red-800">Refund Status Tracking</h4>
                    <p>Customers can track refund status through their account dashboard. Email and SMS notifications are sent at each stage of the refund process.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="force-majeure" title="Force Majeure & Emergency Situations" icon={AlertTriangle}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">Force Majeure Events</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Natural disasters (earthquakes, floods, cyclones)</li>
                      <li>Government restrictions or lockdowns</li>
                      <li>Pandemic-related travel restrictions</li>
                      <li>Terrorist attacks or civil unrest</li>
                      <li>Infrastructure failures affecting travel</li>
                    </ul>

                    <h4 className="font-semibold text-red-800">Emergency Cancellation Benefits</h4>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Full refund regardless of cancellation timing</li>
                        <li>No cancellation charges applied</li>
                        <li>Expedited refund processing (24-48 hours)</li>
                        <li>Future booking credits with extended validity</li>
                        <li>Priority rebooking assistance</li>
                      </ul>
                    </div>

                    <h4 className="font-semibold text-red-800">Documentation Requirements</h4>
                    <p>Emergency cancellations require appropriate documentation such as medical certificates, government advisories, or official notifications to qualify for special consideration.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection id="contact-support" title="Cancellation Support & Contact" icon={Users}>
                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-red-800">24/7 Cancellation Support</h4>
                    <p>Our dedicated support team is available round-the-clock to assist with cancellations, modifications, and refund queries.</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-red-800">Contact Methods</h5>
                        <ul className="space-y-2 mt-2">
                          <li>📞 Phone: +91-9895783841</li>
                          <li>📧 Email: support@driveconnect.com</li>
                          <li>💬 Live Chat: Available 24/7</li>
                          <li>📱 WhatsApp: +91-9895783845</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-800">Self-Service Options</h5>
                        <ul className="space-y-2 mt-2">
                          <li>🔐 Account Dashboard</li>
                          <li>📋 FAQ Section</li>
                        </ul>
                      </div>
                    </div>

                    <h4 className="font-semibold text-red-800">Response Time Guarantee</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Phone support: Immediate assistance</li>
                        <li>Live chat: Within 2 minutes</li>
                        <li>Email queries: Within 4 hours</li>
                        <li>WhatsApp: Within 30 minutes</li>
                        <li>Emergency situations: Immediate priority handling</li>
                      </ul>
                    </div>
                  </div>
                </ExpandableSection>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100 max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">
              For any questions regarding these policies, please contact our support team.
            </p>
            <div className="flex justify-center space-x-4">
              <button
              onClick={()=> navigate("/contact-us")}
               className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md">
                Contact Support
              </button>

            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 DriveConnect. All rights reserved. | Privacy Policy | Terms of Service</p>
          <p className="mt-1">Platform operated under license from relevant authorities</p>
        </div>
      </div>
    </div>
  );
}