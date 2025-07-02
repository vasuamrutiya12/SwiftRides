import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/LandingPages/Home";
import Register from "./components/LandingPages/Register";
import Login from "./components/LandingPages/Login";
import AboutUs from "./components/LandingPages/AboutUs";
import ContactUs from "./components/LandingPages/ContactUs";
import CarRentalPlatform from "./components/CarComponents/CarRentalPlatform";
import BookCarForm from "./components/BookingCar/bookCarForm";
import RegisterOTP from "./components/LandingPages/RegisterOTP";
import CustomerDashboard from "./components/Customer/CustomerDashboard";
import Dashboard from "./components/RentalCompany/Dashboard";
import CarManagement from "./components/RentalCompany/Car/CarManagement";
import Bookings from "./components/RentalCompany/Booking/Booking";
import Reviews from "./components/RentalCompany/Review/Reviews";
import Payments from "./components/RentalCompany/Payment/Payment";
import CarDetails from "./components/CarComponents/CarDetail";

import AdminDashboard from "./components/Admin/Dashboard";
import AdminBooking from "./components/Admin/Booking/Bookings";
import AdminRentalCompany from "./components/Admin/RentalCom/RentalCompanies";
import AdminCustoQueries from "./components/Admin/CustoQueries/CustomerQueries";
import AdminCustomer from "./components/Admin/Customers/Customer";

import { BookingProvider } from "./components/BookingCar/BookingContext";
import { LoadingProvider } from "./components/Loader/LoadingProvider";
import NetworkDetector from "./components/LandingPages/NetworkDetector";
import PageNotFound from "./components/LandingPages/PageNotFound";
import CarRentalPolicies from "./components/LandingPages/CarRentalPolicies";
import ForgotPassword from "./components/LandingPages/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const userRole = localStorage.getItem("role") || "guest";
  return (
    <NetworkDetector>
      <LoadingProvider>
        <BookingProvider>
          <Routes>

            <Route path="*" element={<Navigate to="/pagenotfound" replace />} />
            <Route path="/pagenotfound" element={<PageNotFound />} />


            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-otp" element={<RegisterOTP />} />
            <Route path="/login" element={<Login />} />
            <Route path="/all-car" element={<CarRentalPlatform />} />
            <Route path="/car/cardetails" element={<CarDetails />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/support/term-conditions-policy" element={<CarRentalPolicies />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/booking-form"
                element={
                  <ProtectedRoute allowedRoles={["CUSTOMER"]} userRole={userRole}>
                    <BookCarForm />
                  </ProtectedRoute>
                } 
              />
            <Route path="/customer-dashboard" element={
                <ProtectedRoute allowedRoles={["CUSTOMER"]} userRole={userRole}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />

            <Route path="/dashboard"
              element={
                  <ProtectedRoute allowedRoles={["RENTAL_COMPANY"]} userRole={userRole}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
            />
            <Route path="/cars" 
              element={
                  <ProtectedRoute allowedRoles={["RENTAL_COMPANY"]} userRole={userRole}>
                    <CarManagement />
                  </ProtectedRoute>
                } 
            />
            <Route path="/bookings" 
            element={
                  <ProtectedRoute allowedRoles={["RENTAL_COMPANY"]} userRole={userRole}>
                    <Bookings />
                  </ProtectedRoute>
                } 
            />
            <Route path="/reviews"
            element={
                  <ProtectedRoute allowedRoles={["RENTAL_COMPANY"]} userRole={userRole}>
                    <Reviews />
                  </ProtectedRoute>
                } 
                />
            <Route path="/payments"
            element={
                  <ProtectedRoute allowedRoles={["RENTAL_COMPANY"]} userRole={userRole}>
                    <Payments />
                  </ProtectedRoute>
                } 
            />

            <Route path="/admin/dashboard"
               element={
                  <ProtectedRoute allowedRoles={["ADMIN"]} userRole={userRole}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
            />
            <Route
              path="/admin/rentalCompany"
              
               element={
                  <ProtectedRoute allowedRoles={["ADMIN"]} userRole={userRole}>
                    <AdminRentalCompany />
                  </ProtectedRoute>
                } 
            />
            <Route path="/admin/customer"
             element={
                  <ProtectedRoute allowedRoles={["ADMIN"]} userRole={userRole}>
                    <AdminCustomer />
                  </ProtectedRoute>
                } 
            />
            <Route
              path="/admin/customer/queries"
              
               element={
                  <ProtectedRoute allowedRoles={["ADMIN"]} userRole={userRole}>
                    <AdminCustoQueries />
                  </ProtectedRoute>
                } 
            />
            <Route path="/admin/bookings"
             element={
                  <ProtectedRoute allowedRoles={["ADMIN"]} userRole={userRole}>
                    <AdminBooking />
                  </ProtectedRoute>
                } 
            />


          </Routes>
        </BookingProvider>
      </LoadingProvider>
    </NetworkDetector>
  );
}

export default App;
