import { Route , BrowserRouter , Routes , Navigate } from 'react-router-dom'
import './App.css'
import Home from './components/LandingPages/Home'
import Register from './components/LandingPages/Register'
import  Login  from './components/LandingPages/Login'
import AboutUs from './components/LandingPages/AboutUs'
import ContactUs from './components/LandingPages/ContactUs'
import CarRentalPlatform from './components/CarComponents/CarRentalPlatform'
import BookCarForm from './components/BookingCar/bookCarForm'
import RegisterOTP from './components/LandingPages/RegisterOTP'
import CustomerDashboard from './components/Customer/CustomerDashboard'
import Dashboard from './components/RentalCompany/Dashboard'
import CarManagement from './components/RentalCompany/Car/CarManagement'
import Bookings from './components/RentalCompany/Booking/Booking'
import Reviews from './components/RentalCompany/Review/Reviews'
import Payments from './components/RentalCompany/Payment/Payment'
import CarDetails from './components/CarComponents/CarDetail'

import AdminDashboard from "./components/Admin/Dashboard";
// import AdminRevenue from "./components/Admin/Revenue"
import AdminBooking from "./components/Admin/Booking/Bookings"
import AdminRentalCompany from "./components/Admin/RentalCom/RentalCompanies"
import AdminCustoQueries from "./components/Admin/CustoQueries/CustomerQueries"
import AdminCustomer from "./components/Admin/Customers/Customer"

import { BookingProvider } from './components/BookingCar/BookingContext'
// import PageNotFound from './components/LandingPages/PageNotFound'
function App() {
  
  return (
      <BookingProvider >
        <Routes>
          {/* Public Routes */}
          {/* <Route path="*" element={<Navigate to="/pagenotfound" replace />} />
          <Route path="/pagenotfound" element={<PageNotFound />} /> */}


          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/all-car' element={<CarRentalPlatform />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/booking-form" element={<BookCarForm />} />
          <Route path="/register-otp" element={<RegisterOTP />} />
          <Route path='/customer-dashboard' element={<CustomerDashboard />} />

           
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cars" element={<CarManagement />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/payments" element={<Payments />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/rentalCompany" element={<AdminRentalCompany />} />
          <Route path="/admin/Customer" element={<AdminCustomer />} /> 
            {/*<Route path="/admin/revenue" element={<AdminRevenue />} />*/}
            
            <Route path="/admin/customer/queries" element={<AdminCustoQueries />} />
            <Route path="/admin/bookings" element={<AdminBooking />} /> 

            <Route path='/car/cardetails' element={<CarDetails />} />
        </Routes>
      </BookingProvider>
  )
}

export default App