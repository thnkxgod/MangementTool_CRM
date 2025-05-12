import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const ClientView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorSelection, setColorSelection] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchOrderAndItemsAndColors = async () => {
      setLoading(true);
      setError(null);
      try {
        const orderResponse = await axios.get(`http://localhost:3000/api/orders/${id}`);
        setOrder(orderResponse.data);
        const itemIds = orderResponse.data.order_description
          .match(/Item ID: (\d+)/g)
          .map((item) => item.match(/\d+/)[0]);
        const inventoryResponse = await axios.get("http://localhost:3000/api/inventory");
        const filteredItems = inventoryResponse.data.filter((item) =>
          itemIds.includes(item.id.toString())
        );
        setInventoryItems(filteredItems);
        const colorResponse = await axios.get("http://localhost:3000/api/colors");
        setColors(colorResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load order or inventory.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderAndItemsAndColors();
  }, [id]);
  const handleSelectColor = (itemId, colorId) => {
    setColorSelection((prev) => ({
      ...prev,
      [itemId]: colorId, // Store the selected color for this item
    }));
  };
  const handleSelectItem = (itemId) => {
    if (!colorSelection[itemId]) {
      alert("Please select a color first!");
      return;
    }
    // Toggle item selection
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId) // Unselect if already selected
        : [...prevSelected, itemId] // Add item if not selected
    );
  };
  const handleSubmitOrder = async () => {
    try {
      const selectedItemsWithColors = selectedItems.map((itemId) => {
        const item = inventoryItems.find((item) => item.id === itemId);
        return {
          item: item.pname,
          color: colors.find((c) => c.id === colorSelection[itemId])?.name,
        };
      });
      const updatedDescription = selectedItemsWithColors
        .map(({ item, color }) => `Item: ${item}, Color: ${color}`)
        .join(', ');
      // Update the order in the database
      await axios.put(`http://localhost:3000/api/orders/${order.id}`, {
        status: "approved by customer",
        order_description: updatedDescription,
      });
      alert("Your order has been updated successfully!");
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Failed to submit your order. Please try again.");
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  const totalItems = inventoryItems.length;
  const selectedCount = selectedItems.length;
  return (
    <div className="relative h-screen w-full overflow-y-auto snap-y snap-mandatory flex flex-wrap">
      {inventoryItems.map((item, index) => (
        <div
          key={item.id}
          className={`snap-start shrink-0 w-full h-screen flex justify-left items-center relative mb-8 ${
            index % 2 === 0 ? "bg-gray-500" : "bg-orange-50"
          }`}
        >
          <div
            className="parallax bg-no-repeat bg-center flex-shrink-0 mr-auto ml-10"
            style={{
              backgroundImage: `url(${item.images[0] || "/default-background.jpg"})`,
              backgroundSize: "80%",
              width: "70%",
              height: "80%",
              position: "absolute",
            }}
          ></div>
          <div className="relative z-10 bg-blue-50 bg-opacity-100 shadow-lg rounded-lg p-8 ml-auto mr-48 h-[450px] w-[440px] text-center">
            <h2 className="text-4xl font-serif font-semibold italic text-red-700 mb-7 text-center">
              {item.pname}
            </h2>
            <p className="text-xs font-extralight mb-4 text-center">{item.dimension}</p>
            <p className="font-extralight text-xs mb-4 text-center">{item.description}</p>
            <div className="flex justify-center items-center mb-4">
              {item.color.map((colorId) => {
                const color = colors.find((c) => c.id === parseInt(colorId));
                return color ? (
                  <div
                    key={color.id}
                    className={`border-2 rounded-full p-1 mx-2 cursor-pointer ${
                      colorSelection[item.id] === color.id
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleSelectColor(item.id, color.id)}
                  >
                    <img
                      src={color.url}
                      alt={color.name}
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                ) : null;
              })}
            </div>
            <button
              className={`mt-4 w-full py-2 rounded-lg text-center text-white font-semibold shadow transition-all ${
                selectedItems.includes(item.id)
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={() => handleSelectItem(item.id)}
            >
              {selectedItems.includes(item.id)
                ? "Unselect Item"
                : colorSelection[item.id]
                ? "Select Item"
                : "Select Color First"}
            </button>
          </div>
        </div>
      ))}
      {/* Display basket icon with selected count */}
      <div className="fixed top-8 right-8 flex items-center">
        <i className="fa fa-shopping-cart text-white text-xl relative" style={{ color: '#1E90FF' }}>
          {selectedCount > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-sm font-bold rounded-full px-3 py-1">
              {selectedCount}
            </span>
          )}
        </i>
      </div>
      {/* Submit button, floating and visible only if items are selected */}
      {selectedCount > 0 && (
        <div className="fixed bottom-8 right-8">
          <button
            className="py-3 px-6 bg-green-600 text-white text-lg rounded-full shadow-lg hover:bg-green-700 transition-all font-normal"
            onClick={handleSubmitOrder}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};
export default ClientView;