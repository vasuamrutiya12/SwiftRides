import { useEffect, useState } from 'react';
import { Car, Users, MessageSquare, DollarSign, Calendar } from 'lucide-react';
import Navbar from './Navbar';

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalCompanies: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalQueries: 0,
  });
  const token = localStorage.getItem("token");

  const headers = {
    'Content-Type': 'application/json',
    // Add Authorization token if needed:
    'Authorization': `Bearer ${token}`
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          companiesRes,
          customersRes,
          bookingsRes,
          paymentsRes,
          queriesRes,
        ] = await Promise.all([
          fetch('http://localhost:9090/api/rental-company/total', { headers }),
          fetch('http://localhost:9090/api/customers/total', { headers }),
          fetch('http://localhost:9090/api/bookings/total', { headers }),
          fetch('http://localhost:9090/api/payments/total-amount', { headers }),
          fetch('http://localhost:9090/api/contact/total', { headers }),
        ]);


        const companies = await companiesRes.json();
        const customers = await customersRes.json();
        const bookings = await bookingsRes.json();
        const payments = await paymentsRes.json();
        const queries = await queriesRes.json();
      
        

        setStatsData({
          totalCompanies: companies || 0,
          totalCustomers: customers || 0,
          totalBookings: bookings || 0,
          totalRevenue: payments || 0,
          totalQueries: queries || 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Total Companies',
      value: statsData.totalCompanies,
      icon: <Car className="w-8 h-8" />,
      color: 'bg-red-500',
    },
    {
      title: 'Total Customers',
      value: statsData.totalCustomers,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-red-600',
    },
    {
      title: 'Total Bookings',
      value: statsData.totalBookings,
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-red-700',
    },
    {
      title: 'Revenue Generated',
      value: `₹${statsData.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-red-800',
    },
    {
      title: 'Customer Queries',
      value: statsData.totalQueries,
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <Navbar />
      <h2 className="text-2xl font-bold text-gray-800 mx-5">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mx-5">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
