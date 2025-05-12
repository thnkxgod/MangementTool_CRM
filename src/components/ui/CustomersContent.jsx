import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CustomerTable from "./CustomerTable";
import { Button } from "./button";
import { Input } from "./input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "./Pagination";

const CustomersContent = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/customers")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  const deleteCustomer = (id) => {
    fetch(`http://localhost:3000/api/customers/${id}`, { method: "DELETE" })
      .then(() =>
        setCustomers((prev) => prev.filter((customer) => customer.id !== id))
      )
      .catch((error) => console.error("Error deleting customer:", error));
  };

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  // Filter customers based on search term BEFORE slicing for pagination
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered customers
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 h-full w-full text-grey-900 rounded-lg overflow-y-auto scrollbar-hide">
      <div className="flex mb-4 justify-around items-center space-x-2 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold ">Customers</h1>
        {/* Search bar next to Add Customer button */}
        <Input
          type="text"
          placeholder="Search by name "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-900 bg-gray-100 placeholder-gray-400 w-full max-w-md p-2 rounded-lg shadow-gray-300 shadow-md"
        />
        <Button
          onClick={() => navigate("/customers/form")} // Navigate to form
          className="shadow-lg "
        >
          Add Customer
        </Button>
      </div>

      <CustomerTable
        customers={currentCustomers}
        handleDelete={deleteCustomer}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  className={`bg-red-300 hover:bg-[#fe6060] text-white ${
                    currentPage === index + 1 ? "bg-[#bf1717] text-white" : ""
                  }`}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CustomersContent;
