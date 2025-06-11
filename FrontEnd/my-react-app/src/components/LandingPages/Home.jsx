import {
  ChevronRight,
  Star,
  Smartphone,
  Shield,
  Clock,
} from "lucide-react";
import Footer from "./Footer";
// import CarCard from "../CarComponents/CarCard";
import Navbar from "./Navbar";
import CarRentalHero from "./CarRentalHero";

export default function Home() {


  // const featuredCars = [
  //   {
  //     companyId: 252,
  //     make: "Toyota",
  //     model: "Innova",
  //     year: 2026,
  //     category: "suv",
  //     dailyRate: 6000.0,
  //     fuelType: "Petrol",
  //     seatingCapacity: 7,
  //     features: ["GPS", "Bluetooth", "Air Conditioning"],
  //     imageUrls: [
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC-CY4mJacrQhahVixFUocS7q_Ov8mpoKeXA&s",
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxzicKiFHGWsspA9GjHbEIJYk3dbUa4laPcw&s",
  //     ],
  //     status: "available",
  //     createdAt: "2025-05-17T15:16:40.520266",
  //   },
  //   {
  //     companyId: 253,
  //     make: "Honda",
  //     model: "City",
  //     year: 2025,
  //     category: "sedan",
  //     dailyRate: 4500.0,
  //     fuelType: "Hybrid",
  //     seatingCapacity: 5,
  //     features: ["Bluetooth", "Air Conditioning", "Cruise Control"],
  //     imageUrls: [
  //       "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     ],
  //     status: "available",
  //     createdAt: "2025-05-10T09:23:40.520266",
  //   },
  //   {
  //     companyId: 252,
  //     make: "Toyota",
  //     model: "Innova",
  //     year: 2026,
  //     category: "suv",
  //     dailyRate: 6000.0,
  //     fuelType: "Petrol",
  //     seatingCapacity: 7,
  //     features: ["GPS", "Bluetooth", "Air Conditioning"],
  //     imageUrls: [
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC-CY4mJacrQhahVixFUocS7q_Ov8mpoKeXA&s",
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxzicKiFHGWsspA9GjHbEIJYk3dbUa4laPcw&s",
  //     ],
  //     status: "available",
  //     createdAt: "2025-05-17T15:16:40.520266",
  //   },
  //   {
  //     companyId: 254,
  //     make: "Mahindra",
  //     model: "Thar",
  //     year: 2025,
  //     category: "suv",
  //     dailyRate: 7500.0,
  //     fuelType: "Diesel",
  //     seatingCapacity: 4,
  //     features: [
  //       "4x4 Drive",
  //       "Bluetooth",
  //       "Air Conditioning",
  //       "Off-road Capability",
  //     ],
  //     imageUrls: [
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEA4lLqcU-h-fP7EeqnPV-Fxdk3Le4LgPPBg&s",
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5l2Uxi3qGP4qFIQsaSVSzJdnd5_Cemv6WJQ&s",
  //     ],
  //     status: "maintenance",
  //     createdAt: "2025-04-25T11:46:40.520266",
  //   },
  // ];

  const testimonials = [
    {
      id: 1,
      name: "Emily Johnson",
      comment:
        "The booking process was seamless and the car was in perfect condition. Would definitely use again!",
      rating: 5,
      location: "New York, USA",
    },
    {
      id: 2,
      name: "Mark Stevens",
      comment:
        "Great service and competitive prices. The staff was very helpful during pickup and return.",
      rating: 4,
      location: "Los Angeles, USA",
    },
  ];

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      
      <Navbar />
      <CarRentalHero />
      
      {/* Hero Section
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Ride for Any Journey
            </h1>
            <p className="text-xl mb-8">
              Choose from our wide selection of vehicles at competitive rates.
              No hidden fees.
            </p>

            {/* Search Form *
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Pick-up Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      className="pl-10 w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="City, Airport, etc."
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Pick-up Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      className="pl-10 w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      className="pl-10 w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-2 opacity-0">
                    Search
                  </label>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center">
                    <Search className="h-5 w-5 mr-2" />
                    Search Cars
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background element *
        <div className="hidden lg:block absolute right-0 top-0 w-1/3 h-full">
          <img
            src={carImg}
            alt="Car silhouette"
            className="object-cover h-full w-full opacity-20"
          />
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose DrivEasy?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-lg transition">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Quick Booking Process
              </h3>
              <p className="text-gray-600">
                Book your desired vehicle in less than 2 minutes with our
                simplified process.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-lg transition">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Fully Insured Fleet
              </h3>
              <p className="text-gray-600">
                All our vehicles come with comprehensive insurance coverage for
                your peace of mind.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-lg transition">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                24/7 Customer Support
              </h3>
              <p className="text-gray-600">
                Our dedicated team is always available to assist you whenever
                you need help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Vehicles
            </h2>
            <a
              href="#"
              className="flex items-center text-blue-600 hover:text-blue-800 transition"
            >
              View all cars
              <ChevronRight className="h-5 w-5 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredCars.slice(0, 3).map((car, index) => (
              <div key={`${car.companyId}-${index}`} className="visible">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Choose Your Car
              </h3>
              <p className="text-gray-600">
                Browse our extensive fleet and select the perfect vehicle for
                your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Book & Pay Online
              </h3>
              <p className="text-gray-600">
                Secure your reservation with our easy online payment system.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Pick Up & Enjoy
              </h3>
              <p className="text-gray-600">
                Collect your car at your chosen location and hit the road!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What Our Customers Say
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">"{testimonial.comment}"</p>

                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Car className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold text-white">DrivEasy</span>
              </div>
              <p className="mb-4">Making car rentals easy, affordable, and accessible for everyone.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400 transition">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400 transition">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400 transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Home</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Services</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Fleet</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">FAQs</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Cancellation Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Customer Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
              <address className="not-italic">
                <p className="mb-2">123 Rental Street</p>
                <p className="mb-2">New York, NY 10001</p>
                <p className="mb-2">United States</p>
                <p className="mb-2">Phone: +1 (555) 123-4567</p>
                <p className="mb-2">Email: info@driveasy.com</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} DrivEasy Car Rental. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
}
