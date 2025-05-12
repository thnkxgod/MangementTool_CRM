// AddOrderForm.jsx
import { Input } from "./input";
import { Button } from "./button";
import PropTypes from "prop-types";

const AddOrderForm = ({
  newOrder,
  customerName,
  handleChange,
  handleSubmit,
  setShowInventory,
  orderDescription,
}) => {
  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Add New Order</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="customer_id"
          value={newOrder.customer_id}
          onChange={handleChange}
          placeholder="Customer ID"
          required
          className="border p-2 w-full rounded-lg mb-4 bg-gray-200"
        />
        {customerName && (
          <p className="text-gray-700 mb-4">
            Customer Name: {customerName}
          </p>
        )}
        <Input
          type="text"
          name="status"
          value={newOrder.status}
          onChange={handleChange}
          placeholder="Status"
          required
          className="border p-2 w-full rounded-lg mb-4 bg-gray-200"
        />
        <Input
          type="number"
          name="total_amount"
          value={newOrder.total_amount}
          onChange={handleChange}
          placeholder="Total Amount"
          required
          className="border p-2 w-full rounded-lg mb-4 bg-gray-200"
        />
        <Button
          type="button"
          onClick={() => setShowInventory(true)} // Show inventory modal
          className="px-4 py-2 mb-4 rounded-lg"
        >
          Select Items from Inventory
        </Button>
        <p className="text-black mb-4">
          Selected Items: {orderDescription || "None"}
        </p>
        <Button type="submit" className="px-4 py-2 rounded-lg shadow-lg">
          Add Order
        </Button>
      </form>
    </div>
  );
};

// PropTypes validation
AddOrderForm.propTypes = {
    newOrder: PropTypes.object.isRequired,
    setNewOrder: PropTypes.func.isRequired,
    customerName: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setShowInventory: PropTypes.func.isRequired,
    orderDescription: PropTypes.string // Add prop validation for orderDescription
  };
export default AddOrderForm;
