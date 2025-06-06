import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "./input";
import OrdersTable from "./OrderTable";
import { Button } from "./button";
import { jsPDF } from "jspdf"; // For generating PDF
import AddOrderForm from "./OrderForm";
import InventorySelectionModal from "./OrderSelectionModal";
import * as XLSX from "xlsx";

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [inventory, setInventory] = useState([]); // To store inventory items
  const [filteredInventory, setFilteredInventory] = useState([]); // For filtered inventory items based on search
  const [selectedItems, setSelectedItems] = useState([]); // To store selected inventory items
  const [newOrder, setNewOrder] = useState({
    customer_id: "",
    status: "",
    total_amount: "",
    order_description: "",
  });
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showInventory, setShowInventory] = useState(false); // To toggle inventory selection modal
  const [searchQuery, setSearchQuery] = useState(""); // For the search input
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Fetch all orders, customers, and inventory
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersResponse = await axios.get(
          "http://localhost:3000/api/orders"
        );
        setOrders(ordersResponse.data);

        const customersResponse = await axios.get(
          "http://localhost:3000/api/customers"
        );
        const customersMap = {};
        customersResponse.data.forEach((customer) => {
          customersMap[customer.id] = customer.name;
        });
        setCustomers(customersMap);

        // Fetch inventory items
        const inventoryResponse = await axios.get(
          "http://localhost:3000/api/inventory"
        );
        setInventory(inventoryResponse.data);
        setFilteredInventory(inventoryResponse.data); // Initialize filtered inventory
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle input change for the new order form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));

    // Fetch customer name if customer_id changes
    if (name === "customer_id" && value) {
      setCustomerName(customers[value] || "Loading...");
    }
  };

  // Handle inventory item selection
  const handleSelectItem = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item) // Deselect if already selected
        : [...prevSelected, item]
    );
  };
  const handleToggleOrderSelection = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getSelectedOrders = () => {
    return orders.filter((order) => selectedOrderIds.includes(order.id));
  };

  // Generate order description based on selected items
  const generateDescription = () => {
    const description = selectedItems
      .map((item) => `Item ID: ${item.id} (x1)`)
      .join(", "); // Include item ID
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      order_description: description,
    }));
    setShowInventory(false); // Close inventory modal
  };

  // Handle form submission to add a new order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        newOrder
      );
      setOrders((prevOrders) => [...prevOrders, response.data]); // Add the new order to the list
      setNewOrder({
        customer_id: "",
        status: "",
        total_amount: "",
        order_description: "",
      });
      setCustomerName("");
      setSelectedItems([]); // Reset selected items
      setShowForm(false);
    } catch {
      setError("Failed to add order.");
    } finally {
      setLoading(false);
    }
  };

  // Handle order deletion
  const handleRemove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/orders/${id}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== id)
        );
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const customerNameMatches = customers[order.customer_id]
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const orderIdMatches = order.id.toString().includes(searchQuery);
    return customerNameMatches || orderIdMatches;
  });

  // Filter inventory items based on search query
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = inventory.filter((item) =>
      item.pname.toLowerCase().includes(query)
    );
    setFilteredInventory(filtered);
  };

  const handleCopyUrl = (orderId) => {
    const clientUrl = `${window.location.origin}/order/v4/${orderId}`;
    navigator.clipboard
      .writeText(clientUrl)
      .then(() => alert(`URL copied: ${clientUrl}`))
      .catch((err) => console.error("Failed to copy URL", err));
  };

  // Function to generate and download a PDF of all approved orders
  const generatePdf = () => {
    const doc = new jsPDF();
    const selected = getSelectedOrders();

    if (selected.length === 0) {
      alert("No orders selected.");
      return;
    }

    let y = 10;
    doc.setFontSize(18);
    doc.text("Selected Orders Report", 10, y);
    y += 10;

    selected.forEach((order, index) => {
      const customerName = customers[order.customer_id] || "Unknown Customer";
      const createdAt = new Date(order.created_at).toLocaleString();

      doc.setFontSize(12);
      doc.text(`Order ${index + 1}:`, 10, y);
      y += 6;
      doc.text(`ID: ${order.id}`, 10, y);
      y += 6;
      doc.text(`Customer: ${customerName}`, 10, y);
      y += 6;
      doc.text(`Status: ${order.status}`, 10, y);
      y += 6;
      doc.text(`Amount: $${order.total_amount}`, 10, y);
      y += 6;
      doc.text(`Desc: ${order.order_description}`, 10, y);
      y += 6;
      doc.text(`Created At: ${createdAt}`, 10, y);
      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("selected_orders.pdf");
  };

  // Function to generate and download an Excel file of approved orders
  const generateExcel = () => {
    const selected = getSelectedOrders();

    if (selected.length === 0) {
      alert("No orders selected.");
      return;
    }

    const data = selected.map((order) => ({
      "Order ID": order.id,
      "Customer ID": order.customer_id,
      "Customer Name": customers[order.customer_id] || "Unknown",
      Status: order.status,
      "Total Amount": `$${order.total_amount}`,
      Description: order.order_description || "N/A",
      "Created At": order.created_at
        ? new Date(order.created_at).toLocaleString()
        : "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Selected Orders");
    XLSX.writeFile(wb, "selected_orders.xlsx");
  };

  const handleDownloadPdf = (order) => {
    const doc = new jsPDF();
    const customerName = customers[order.customer_id] || "Unknown Customer";
    const createdAt = order.created_at
      ? new Date(order.created_at).toLocaleString()
      : "N/A";

    doc.setFontSize(16);
    doc.text("Order Summary", 10, 10);
    doc.setFontSize(12);
    let y = 20;

    doc.text(`Order ID: ${order.id}`, 10, y);
    y += 6;
    doc.text(`Customer ID: ${order.customer_id}`, 10, y);
    y += 6;
    doc.text(`Customer Name: ${customerName}`, 10, y);
    y += 6;
    doc.text(`Status: ${order.status}`, 10, y);
    y += 6;
    doc.text(`Total Amount: $${order.total_amount}`, 10, y);
    y += 6;
    doc.text(`Description: ${order.order_description || "N/A"}`, 10, y);
    y += 6;
    doc.text(`Created At: ${createdAt}`, 10, y);

    doc.save(`order_${order.id}.pdf`);
  };

  const handleDownloadExcel = (order) => {
    const customerName = customers[order.customer_id] || "Unknown Customer";
    const createdAt = order.created_at
      ? new Date(order.created_at).toLocaleString()
      : "N/A";

    const data = [
      {
        "Order ID": order.id,
        "Customer ID": order.customer_id,
        "Customer Name": customerName,
        Status: order.status,
        "Total Amount": `$${order.total_amount}`,
        Description: order.order_description || "N/A",
        "Created At": createdAt,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order");

    XLSX.writeFile(wb, `order_${order.id}.xlsx`);
  };

  return (
    <div className="p-4 h-auto w-full overflow-y-auto scrollbar-hide">
      <div className="flex justify-around items-center mb-6">
        <h1 className="text-3xl font-bold">Order List</h1>

        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Customer Name or Order ID"
          className="text-gray-900 bg-gray-100 placeholder-gray-400 w-full max-w-md p-2 rounded-lg shadow-gray-300 shadow-md"
        />

        <div className="flex justify-around space-x-4 p-2">
          <Button
            onClick={() => setShowForm((prev) => !prev)}
            className="py-2 rounded-lg shadow-lg"
          >
            {showForm ? "Cancel" : "Add New Order"}
          </Button>
          <Button onClick={generatePdf} className="py-2 rounded-lg shadow-lg">
            Download PDF
          </Button>
          <Button onClick={generateExcel}>Download Excel</Button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Add New Order Form */}
      {showForm && (
        <AddOrderForm
          newOrder={newOrder}
          customerName={customerName}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowInventory={setShowInventory}
          orderDescription={newOrder.order_description}
        />
      )}

      {/* Inventory Selection Modal */}
      <InventorySelectionModal
        showInventory={showInventory}
        setShowInventory={setShowInventory}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        filteredInventory={filteredInventory}
        handleSelectItem={handleSelectItem}
        selectedItems={selectedItems}
        generateDescription={generateDescription}
      />

      {/* Display Orders Table when not showing form */}
      {!showForm && (
        <OrdersTable
          orders={filteredOrders}
          customers={customers}
          handleCopyUrl={handleCopyUrl}
          handleRemove={handleRemove}
          handleDownloadPdf={handleDownloadPdf}
          handleDownloadExcel={handleDownloadExcel}
          selectedOrderIds={selectedOrderIds}
          handleToggleOrderSelection={handleToggleOrderSelection}
        />
      )}
    </div>
  );
};

export default OrdersContent;
