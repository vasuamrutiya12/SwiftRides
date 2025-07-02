import { useEffect, useState } from "react";
import SearchFilter from "../SearchFilter";
import CarCard from "./CarCard";
import AddCarForm from "./AddCarForm";
import { Plus } from "lucide-react";
import Navbar from "../Navbar";
import ItemsPerPageSelector from "../Booking/ItemsPerPageSelector";
import Pagination from "../Booking/Pagination";
import { useLoading } from "../../Loader/LoadingProvider";
import EditCarModal from "./EditCarModal";
import DeleteCarModal from "./DeleteCarModal";

export default function CarManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoading();
  const [selectedCar, setSelectedCar] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit' | 'delete' | null

  const fetchCars = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      console.error("Missing token or email in localStorage");
      return;
    }

    showLoader("Loading car data...");
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
      const response = await fetch(`http://localhost:9090/api/cars/companyid/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }

      const data = await response.json();
      console.log(data);
      
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showAddForm ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAddForm]);

  const filterOptions = [
    { value: "all", label: "All Cars" },
    { value: "available", label: "Available" },
    { value: "rented", label: "Rented" },
    { value: "maintenance", label: "Maintenance" },
  ];

  const searchFields = ["make", "model", "category"];

  const filteredCars = cars.filter((car) => {
    const matchesSearch = searchFields.some((field) =>
      car[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = filterStatus === "all" || car.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleCarAdded = () => {
    fetchCars();
    setShowAddForm(false);
  };

  const handleEditClick = (car) => {
    setSelectedCar(car);
    setModalType('edit');
  };

  const handleDeleteClick = (car) => {
    setSelectedCar(car);
    setModalType('delete');
  };

  const handleModalClose = () => {
    setSelectedCar(null);
    setModalType(null);
  };

  const handleUpdateCar = async (updatedCar) => {
    const token = localStorage.getItem("token");
    showLoader("Updating car...");
    try {
      const response = await fetch(`http://localhost:9090/api/cars/${updatedCar.carId || updatedCar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCar),
      });
      if (!response.ok) throw new Error("Failed to update car");
      await fetchCars();
    } catch (error) {
      alert("Failed to update car. Please try again.");
      console.error(error);
    } finally {
      hideLoader();
      handleModalClose();
    }
  };

  const handleDeleteCar = async (carId) => {
    const token = localStorage.getItem("token");
    showLoader("Deleting car...");
    try {
      const response = await fetch(`http://localhost:9090/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete car");
      await fetchCars();
    } catch (error) {
      alert("Failed to delete car. Please try again.");
      console.error(error);
    } finally {
      hideLoader();
      handleModalClose();
    }
  };

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="flex items-center justify-between mx-5">
        <h1 className="text-3xl font-bold text-gray-900">Car Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Car</span>
        </button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        filterOptions={filterOptions}
        placeholder="Search cars by make, model, or category..."
      />

      <ItemsPerPageSelector
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {loading ? (
        <div className="text-center py-12 mx-5 text-gray-500">Loading...</div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-12 mx-5 text-gray-500">
          No cars found matching your criteria.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mx-5">
            {currentCars.map((car) => (
              <CarCard
                key={car.carId}
                car={car}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredCars.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

      {showAddForm && <AddCarForm onClose={() => setShowAddForm(false)} onCarAdded={handleCarAdded} />}

      {/* Render modals at the top level for full-screen blur and centering */}
      {modalType === 'edit' && selectedCar && (
        <EditCarModal
          car={selectedCar}
          onClose={handleModalClose}
          onUpdate={handleUpdateCar}
        />
      )}
      {modalType === 'delete' && selectedCar && (
        <DeleteCarModal
          car={selectedCar}
          onClose={handleModalClose}
          onDelete={() => handleDeleteCar(selectedCar.carId || selectedCar.id)}
        />
      )}
    </div>
  );
}
