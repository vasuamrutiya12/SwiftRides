import { useState, useEffect } from "react";
import SearchFilter from "../../RentalCompany/SearchFilter";
import CompanyCard from "./CompanyCard"; // Changed from BookingCard to CompanyCard
import Navbar from "../Navbar";
import ItemsPerPageSelector from "../../RentalCompany/Booking/ItemsPerPageSelector";
import Pagination from "../../RentalCompany/Booking/Pagination";

export default function RentalCompanies() {
  // Renamed from Bookings to RentalCompanies
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [companies, setCompanies] = useState([]);
  const token = localStorage.getItem("token"); // Replace with your actual token
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          "http://localhost:9090/api/rental-company",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Edit and Delete handlers
  const handleEdit = async (companyId, updatedData) => {
    console.log("Edit company:", companyId, "Updated data:", updatedData);

    try {
      const response = await fetch(
        `http://localhost:9090/api/rental-company/${companyId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update company");
      }

      const updatedCompany = await response.json();

      // ✅ Update local state only after success
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.companyId === companyId
            ? { ...company, ...updatedCompany }
            : company
        )
      );

      console.log("Company updated successfully");
    } catch (error) {
      console.error("Error updating company:", error.message);
      alert("Failed to update company. Please try again.");
    }
  };

  const handleDelete = async (companyId) => {
    console.log("Delete company:", companyId);

    const confirmed = window.confirm(
      "Are you sure you want to delete this company? This action cannot be undone."
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:9090/api/rental-company/${companyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete company");
      }

      // ✅ Remove company from state
      const updatedCompanies = companies.filter(
        (company) => company.companyId !== companyId
      );
      setCompanies(updatedCompanies);

      // ✅ Handle pagination reset if needed
      const newTotalPages = Math.ceil(updatedCompanies.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(1);
      }

      console.log("Company deleted successfully");
    } catch (error) {
      console.error("Error deleting company:", error.message);
      alert("Failed to delete company. Please try again.");
    }
  };

  const handleCarVerification = async (verificationData) => {
    console.log("🚗 Car Verification Data for Backend:", verificationData);

    // Here you would typically make an API call to your backend
    // const response = await fetch('/api/admin/verify-car', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(verificationData)
    // });

    // Update local state to reflect the verification
    setCompanies((prev) =>
      prev.map((company) => ({
        ...company,
        cars: company.cars.map((car) =>
          car.carId === verificationData.carId
            ? {
                ...car,
                verificationStatus: verificationData.verificationStatus,
                verifiedAt: verificationData.verifiedAt,
                verifiedBy: verificationData.verifiedBy,
              }
            : car
        ),
      }))
    );

    // Show success message
    alert(
      `Car ${
        verificationData.verificationStatus === "approved"
          ? "approved"
          : "rejected"
      } successfully!`
    );
  };

  const filterOptions = [
    { value: "all", label: "All Companies" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Fixed filtering logic
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.phoneNumber.includes(searchTerm) ||
      company.cars.some(
        (car) =>
          car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      filterStatus === "all" || company.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Fixed pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <Navbar />

      <div className="flex items-center justify-between mx-5">
        <h1 className="text-3xl font-bold text-gray-900">
          Rental Companies Management
        </h1>
        <div className="text-sm text-gray-500">
          Total Companies: {companies.length} | Active:{" "}
          {companies.filter((c) => c.status === "active").length}
        </div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        filterOptions={filterOptions}
        placeholder="Search by company name, city, address, phone, or car details..."
      />

      <ItemsPerPageSelector
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {currentCompanies.length === 0 ? (
        <div className="text-center py-12 mx-5">
          <div className="text-gray-500 text-lg">
            {filteredCompanies.length === 0
              ? "No rental companies found matching your criteria"
              : "Loading..."}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-5">
            {currentCompanies.map((company) => (
              <CompanyCard
                key={company.companyId}
                company={company}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCarVerification={handleCarVerification}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredCompanies.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </div>
  );
}
