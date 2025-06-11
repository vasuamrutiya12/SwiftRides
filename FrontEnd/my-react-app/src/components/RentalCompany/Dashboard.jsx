import { useEffect, useState } from "react";
import StatsCard from "../RentalCompany/StatsCard";
import { Car, Calendar, Star, CreditCard, TrendingUp, Users } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "../LandingPages/Footer";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resId = await fetch("http://localhost:8084/auth/user/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        const id = await resId.json();

        const res = await fetch(`http://localhost:9090/api/reviews/companyId/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const reviewsData = await res.json()

        const enrichedReviews = await Promise.all(
          reviewsData.map(async (review) => {
            const [carRes, customerRes] = await Promise.all([
              fetch(`http://localhost:9090/api/cars/${review.carId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res) => res.json()),
              fetch(`http://localhost:9090/api/customers/${review.customerId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res) => res.json()),
            ])

            return {
              id: review.reviewId,
              customerName: customerRes.fullName,
              carName: `${carRes.make} ${carRes.model}`,
              rating: review.rating,
              comment: review.comment,
              date: new Date(review.createdAt).toISOString().split("T")[0],
              customerAvatar: "/placeholder.svg?height=40&width=40",
            }
          })
        )        
        const averageRating =
          reviewsData.length > 0
            ? reviewsData.reduce((sum, reviewsData) => sum + reviewsData.rating, 0) / reviewsData.length
            : 0
            

        const [
          carsRes,
          bookingsRes,
          reviewsRes,
          revenueRes,
          ratingRes,
          customersRes,
        ] = await Promise.all([
          fetch(`http://localhost:9090/api/cars/total/companyId/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.ok ? res.json() : Promise.reject("Total Cars fetch failed")),

          fetch("http://localhost:9090/api/cars/count/status/booked", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.ok ? res.json() : Promise.reject("Bookings fetch failed")),

          reviewsData.length,

          fetch("http://localhost:9090/api/cars/count/status/booked", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),

          averageRating,

          fetch(`http://localhost:9090/api/bookings/companyId/${id}/bookingCustomers`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),
        ]);

        setStats([
          {
            title: "Total Cars",
            value: carsRes,
            icon: Car,
            color: "bg-red-500",
            change: "+12%",
            changeType: "positive",
          },
          {
            title: "Active Bookings",
            value: bookingsRes,
            icon: Calendar,
            color: "bg-blue-500",
            change: "+8%",
            changeType: "positive",
          },
          {
            title: "Total Reviews",
            value: reviewsRes,
            icon: Star,
            color: "bg-yellow-500",
            change: "+15%",
            changeType: "positive",
          },
          {
            title: "Monthly Revenue",
            value: `$${revenueRes}`,
            icon: CreditCard,
            color: "bg-green-500",
            change: "+23%",
            changeType: "positive",
          },
          {
            title: "Customer Satisfaction",
            value: `${ratingRes}/5`,
            icon: TrendingUp,
            color: "bg-purple-500",
            change: "+0.2",
            changeType: "positive",
          },
          {
            title: "Total Customers",
            value: customersRes,
            icon: Users,
            color: "bg-indigo-500",
            change: "+18%",
            changeType: "positive",
          },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats(); // ✅ call the function
  }, []); // dependencies

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="flex items-center justify-between mx-5">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-5 font-bold h-150">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <Footer />
    </div>
  );
}
