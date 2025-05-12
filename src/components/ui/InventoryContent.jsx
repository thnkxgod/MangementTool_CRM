import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./button";
import { Input } from "./input";
import ItemTable from "./InventoryTable";
import ItemDetailPopup from "./ItemDetailPopup";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./Pagination";

const InventoryContent = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [colors, setColors] = useState([]);

  // Pagination state
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter inventory based on the search term
  const filteredInventory = inventory.filter((item) =>
    item.pname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on filtered items
  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

  // Get paginated items for the current page
  const paginatedItems = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  useEffect(() => {
    // Fetch inventory and colors data from the API
    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:3000/api/inventory");
        setInventory(response.data);
      } catch {
        setError("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    const fetchColors = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/colors");
        setColors(response.data);
      } catch {
        setError("Failed to load colors.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
    fetchColors();
  }, []);

  const handleRemove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/inventory/${id}`);
        setInventory((prevInventory) =>
          prevInventory.filter((item) => item.id !== id)
        );
      } catch (error) {
        console.error("Error removing inventory item:", error);
      }
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  const handleEdit = (id) => {
    // Navigate to the edit form or open a modal for editing
    navigate(`/inventory/edit/${id}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="p-4 w-full overflow-y-scroll scrollbar-hide">
      <div className="space-x-2 flex justify-around items-center">
        <h2 className="text-2xl font-bold mb-4">Inventory List</h2>
        {/* Search bar */}
        <Input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-900 bg-gray-100 placeholder-gray-400 w-full max-w-md shadow-gray-300 shadow-md"
        />
        <div className="flex p-2 space-x-4">
          <Button onClick={() => navigate("/inventory/form", { state: { mode: "add" } })}>
            Add New Item
          </Button>
          <Button onClick={() => navigate("/inventory/texture")}>
            Textures
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Inventory table */}
      <ItemTable
        paginatedItems={paginatedItems}
        handleItemClick={handleItemClick}
        handleRemove={handleRemove}
        handleEdit={handleEdit}
      />

      {/* Item details popup */}
      {selectedItem && (
        <ItemDetailPopup
          selectedItem={selectedItem}
          colors={colors}
          handleCloseDetail={handleCloseDetail}
          sliderSettings={settings}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePreviousPage} />
            </PaginationItem>

            {/* Dynamically generate pagination numbers */}
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  className={index + 1 === currentPage ? "font-bold cursor-pointer" : ""}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={handleNextPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default InventoryContent;
