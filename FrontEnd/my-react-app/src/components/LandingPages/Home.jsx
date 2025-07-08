import {
  ChevronRight,
  Star,
  Smartphone,
  Shield,
  Clock,
} from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import CarRentalHero from "./CarRentalHero";

export default function Home() {


  const testimonials = [
    {
      id: 1,
      name: "mihir Patel",
      comment:
        "The booking process was seamless and the car was in perfect condition. Would definitely use again!",
      rating: 5,
      location: "nikol , ahmedabad",
    },
    {
      id: 2,
      name: "Max Roy",
      comment:
        "Great service and competitive prices. The staff was very helpful during pickup and return.",
      rating: 4,
      location: "char darvaja , baroda",
    },
  ];

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      
      <Navbar />
      <CarRentalHero />
      
      

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

      <Footer />
    </div>
  );
}
