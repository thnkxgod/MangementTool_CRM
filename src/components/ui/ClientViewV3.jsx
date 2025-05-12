import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import redlogo from "./../../assets/redbrick-white-logo.svg";
const ClientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorSelection, setColorSelection] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [comments, setComments] = useState({});
  const [feedbackComment, setFeedbackComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null); // State for full-screen image
  useEffect(() => {
    const fetchOrderAndItemsAndColors = async () => {
      setLoading(true);
      setError(null);
      try {
        const orderResponse = await axios.get(
          `http://localhost:3000/api/orders/${id}`
        );
        setOrder(orderResponse.data);
        const itemIds = orderResponse.data.order_description
          .match(/Item ID: (\d+)/g)
          .map((item) => item.match(/\d+/)[0]);
        const inventoryResponse = await axios.get(
          "http://localhost:3000/api/inventory"
        );
        const filteredItems = inventoryResponse.data.filter((item) =>
          itemIds.includes(item.id.toString())
        );
        setInventoryItems(filteredItems);
        const colorResponse = await axios.get(
          "http://localhost:3000/api/colors"
        );
        setColors(colorResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        navigate("/approved");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderAndItemsAndColors();
  }, [id, navigate]);
  const handleSelectColor = (itemId, colorId) => {
    setColorSelection((prev) => ({
      ...prev,
      [itemId]: colorId,
    }));
  };
  const handleSelectItem = (itemId) => {
    if (!colorSelection[itemId]) {
      alert("Please select a color first!");
      return;
    }
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };
  const handleSubmitOrder = async () => {
    try {
      const selectedItemsWithColorsAndComments = selectedItems.map((itemId) => {
        const item = inventoryItems.find((item) => item.id === itemId);
        return {
          item: item.pname,
          color: colors.find((c) => c.id === colorSelection[itemId])?.name,
          comment: comments[itemId] || "No comment",
        };
      });
      const updatedDescription =
        selectedItemsWithColorsAndComments
          .map(
            ({ item, color, comment }) =>
              `Item: ${item}, Color: ${color}, Comment: ${comment}`
          )
          .join(", ") + `, Feedback: ${feedbackComment}`;
      await axios.put(`http://localhost:3000/api/orders/${order.id}`, {
        status: "approved by customer",
        order_description: updatedDescription,
      });
      alert("Your order has been updated successfully!");
      navigate("/approved");
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Failed to submit your order. Please try again.");
    }
  };
  const handleCommentChange = (itemId, commentText) => {
    setComments((prevComments) => ({
      ...prevComments,
      [itemId]: commentText,
    }));
  };
  const handleImageClick = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };
  const handleCloseFullScreen = () => {
    setFullScreenImage(null);
  };
  if (loading) return <p>Loading...</p>;
  const selectedCount = selectedItems.length;
  return (
    <div className="relative h-screen w-full overflow-y-auto snap-y snap-mandatory flex flex-wrap bg-white">
      {inventoryItems.map((item, index) => (
        <div
          key={item.id}
          className={`snap-start shrink-0 w-full h-screen flex justify-left items-center relative mb-8 ${
            index % 2 === 0 ? "bg-white" : "bg-white bg-opacity-50"
          }`}
          style={{
            backgroundImage: `url(${
              item.images && item.images.length > 0
                ? item.images[0]
                : "/default-background.jpg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="absolute inset-0 bg-white"
            style={{
              opacity: 0.4,
            }}
          ></div>
          <div
            className={`parallax p-4 bg-no-repeat bg-center flex-shrink-0 mr-auto ml-10 relative cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[140%]  hover:translate-x-[10%] z-10`}
            style={{
              backgroundImage: `url(${
                item.images && item.images.length > 0
                  ? item.images[0]
                  : "/default-background.jpg"
              })`,
              backgroundSize: "80%",
              width: "60%",
              height: "70%",
              position: "absolute",
            }}
            onClick={() =>
              handleImageClick(
                item.images && item.images.length > 0
                  ? item.images[0]
                  : "/default-background.jpg"
              )
            }
          >
            {selectedItems.includes(item.id) && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-bold text-pretty z-20">
                SELECTED
              </div>
            )}
          </div>
          <div className="relative bg-[#AFAFAF] bg-opacity-100 rounded-xl p-8 ml-auto mr-48 h-[450px] w-[440px] text-center overflow-auto scrollbar-hide ">
            <h2 className="text-5xl font-serif font-semibold italic text-red-700 mb-7 text-center">
              {item.pname}
            </h2>
            <p className="text-sm font-normal mb-4 text-center">
              {item.dimension}
            </p>
            <p className="text-sm font-light mb-4 text-center">
              {item.description}
            </p>
            <div className="flex justify-center items-center mb-4">
              {item.color.map((colorId) => {
                const color = colors.find((c) => c.id === parseInt(colorId));
                return color ? (
                  <div
                    key={color.id}
                    className={`border-2 p-1 mx-1 cursor-pointer ${
                      colorSelection[item.id] === color.id
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleSelectColor(item.id, color.id)}
                  >
                    <img
                      src={color.url}
                      alt={color.name}
                      className="h-24 w-28"
                    />
                  </div>
                ) : null;
              })}
            </div>
            <button
              className={`mt-4 w-full py-2 rounded-lg text-center text-white font-semibold shadow transition-all ${
                selectedItems.includes(item.id)
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={() => handleSelectItem(item.id)}
            >
              {selectedItems.includes(item.id)
                ? "Unselect Item"
                : colorSelection[item.id]
                ? "Select Item"
                : "Select Color First"}
            </button>
            {selectedItems.includes(item.id) && (
              <div className="mt-4">
                <textarea
                  className="w-full h-12 bg-white p-2 border border-gray-300 rounded-sm"
                  placeholder="Leave a comment for this item..."
                  value={comments[item.id] || ""}
                  onChange={(e) => handleCommentChange(item.id, e.target.value)}
                ></textarea>
              </div>
            )}
          </div>
        </div>
      ))}



      {/* Red border on the left side */}
      <div className="fixed left-0 top-0 h-full w-16 bg-red-600"></div>
      {/* Display company logo on the right side */}
      <div className="fixed right-2 bg-black w-44 p-4 bg-opacity-45 b-2xl">
        <img src={redlogo} alt="Company Logo" className="size-36 h-8 " />
      </div>
      {selectedCount > 0 && (
        <div className="fixed bottom-8 right-16">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md shadow-md"
            onClick={handleSubmitOrder}
          >
            Submit Order
          </button>
        </div>
      )}

      {/* Feedback Comment Box */}
      {selectedCount > 0 && (
        <div className="fixed w-1/2 bottom-1 right-1/4">
          <textarea
            className="w-full h-16 bg-white p-2 border border-red-800 rounded-md"
            placeholder="Leave any additional feedback..."
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          ></textarea>
        </div>
      )}


      {/* Full-screen image modal */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-100 flex justify-center items-center z-20"
          onClick={handleCloseFullScreen}
        >
          <img src={fullScreenImage} alt="Full Screen" className="h-full w-fit "  />
        </div>
      )}
    </div>
  );
};
export default ClientView;