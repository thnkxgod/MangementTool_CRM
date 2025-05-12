import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import redlogo from "./../../assets/redbrick-white-logo.svg";
import leftIcon from "../../assets/icons/left.svg";
import rightIcon from "../../assets/icons/right.svg";

import { Button } from "./button";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [fullScreenImages, setFullScreenImages] = useState([]);
  const [dimensions, setDimensions] = useState([]); // Store fetched dimensions--------
  const [selectedDimension, setSelectedDimension] = useState(""); //--------

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

    const fetchDimensions = async () => {
      try {
        const dimensionResponse = await axios.get(
          "http://localhost:3000/api/dimensions"
        );
        setDimensions(dimensionResponse.data);
      } catch (err) {
        console.error("Error fetching dimensions:", err);
      }
    };

    fetchOrderAndItemsAndColors();
    fetchDimensions(); // Fetch dimensions on component mount --------
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

  const openFullScreenImage = (image, images) => {
    setFullScreenImage(image);
    setFullScreenImages(images);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
    setFullScreenImages([]);
  };

  if (loading) return <p>Loading...</p>;
  const selectedCount = selectedItems.length;

  return (
    <div className="relative h-screen w-full overflow-y-auto scrollbar-hide snap-y snap-mandatory">
      {/* Display company logo on the left side */}
      <div className="fixed left-16 bg-black w-40 p-4 bg-opacity-75 rounded-b-3xl z-10">
        <img src={redlogo} alt="Company Logo" className="size-36 h-8 " />
      </div>

      {inventoryItems.map((item) => {
        // Ensure color selection starts at the first color index on load
        const selectedColorIndex = colorSelection[item.id]
          ? item.color.findIndex(
              (colorId) => colorSelection[item.id] === parseInt(colorId)
            )
          : 0; // Default to first color index if no selection exists

        // Determine the image URL for the selected color index, with fallback message if not available
        const selectedImageUrl =
          item.images && item.images[selectedColorIndex]
            ? item.images[selectedColorIndex]
            : null; // Null if image for color is unavailable

        return (
          <div
            key={item.id}
            className="snap-start shrink-0 w-full h-screen flex justify-center items-center relative mb-8"
            style={{
              backgroundImage: selectedImageUrl
                ? `url(${selectedImageUrl})`
                : "",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute inset-0 bg-gray-400"
              style={{
                opacity: 0.7,
              }}
            ></div>

            <div className="grid grid-cols-[auto_1.8fr_1.2fr] w-full h-full items-center justify-center">
              <div className="bg-[#bf1717] w-14 h-full z-10"></div>

              {/* Image card section - occupies 75% of the width */}
              <div className="relative">
                {/* Image Section with conditional message */}
                <div className="p-2 min-h-[50vh] h-[500px]">
                  {selectedImageUrl ? (
                    <div
                      className="parallax bg-no-repeat bg-center relative transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
                      style={{
                        backgroundImage: `url(${selectedImageUrl})`,
                        backgroundSize: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                      onClick={() =>
                        openFullScreenImage(selectedImageUrl, item.images)
                      } // Ensure item.images is passed here
                    >
                      {selectedItems.includes(item.id) && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-2xl">
                          SELECTED
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center text-black text-xl">
                      Image is not available for this color
                    </div>
                  )}
                </div>
              </div>

              {/* Card section - occupies 25% of the width */}
              <div className="min-h-[50vh]  flex flex-col items-center justify-center mr-2 shadow-xl p-4">
                <div className="relative bg-[#ececec] bg-opacity-100 p-8 text-center overflow-auto h-[550px] scrollbar-hide rounded-md w-full">
                <h2 className="text-3xl  text-amber-500 font-mono font-semibold  text-center mb-5">
                  {item.pname}
                </h2>
                  <p className="font-semibold text-md mb-4 h-44 text-left content-center overflow-auto scrollbar-hide bg-gradient-to-t from-[#e4e4e4] to-[#ececec] rounded-sm p-4 ">
                    {item.description}
                  </p>

                  <div className="mb-4">
                    {/* Dimension Dropdown */}
                    <select
                      value={selectedDimension}
                      onChange={(e) => setSelectedDimension(e.target.value)}
                      className="w-full p-2 bg-[#ffffff] rounded-md"
                    >
                      <option value="">Select Dimension</option>
                      {dimensions.map((dimension) => (
                        <option key={dimension} value={dimension}>
                          {dimension}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Scrollable Color Carousel */}
                  <div
                    className="relative mb-4"
                    style={{ maxWidth: "100%", maxHeight: "130px" }}
                  >
                    <div className="flex items-center overflow-hidden p-1 relative">
                      {/* Left arrow */}
                      <button
                        className="absolute left-0 z-10 text-gray-600 hover:text-gray-800"
                        style={{ top: "50%", transform: "translateY(-50%)" }}
                        onClick={() => {
                          document
                            .getElementById(`carousel-${item.id}`)
                            .scrollBy({
                              left: -document.getElementById(
                                `carousel-${item.id}`
                              ).clientWidth,
                              behavior: "smooth",
                            });
                        }}
                      >
                        <img
                          src={leftIcon}
                          alt="Left arrow"
                          style={{ width: "30px", height: "30px" }}
                        />
                      </button>

                      {/* Carousel items */}
                      <div
                        id={`carousel-${item.id}`}
                        className="flex space-x-3 overflow-x-auto scrollbar-hide"
                        style={{
                          scrollBehavior: "smooth",
                          width: "100%",
                          maxWidth: "100%",
                        
                        }}
                      >
                        {item.color.map((colorId, index) => {
                          const color = colors.find(
                            (c) => c.id === parseInt(colorId)
                          );
                          return color ? (
                            <div
                              key={color.id}
                              className={`flex-shrink-0 cursor-pointer  ${
                                selectedColorIndex === index
                                  ? "hover:opacity-95"
                                  : "hover:opacity-95"
                              }`}
                              onClick={() =>
                                handleSelectColor(item.id, color.id)
                              }
                              style={{
                                width: "calc((100% - 40px) / 3)", // Adjust width to fit 3 items
                                maxWidth: "25%",
                                padding: "0px",
                                borderRadius: "8px",
                              }}
                            >
                              <img
                                src={color.url}
                                alt={color.name}
                                className="h-full w-full object-contain"
                                style={{
                                  borderRadius: "4px",
                                }}
                              />
                            </div>
                          ) : null;
                        })}
                      </div>

                      {/* Right arrow */}
                      <button
                        className="absolute right-0 z-10 text-gray-600 hover:text-gray-800"
                        style={{ top: "50%", transform: "translateY(-50%)" }}
                        onClick={() => {
                          document
                            .getElementById(`carousel-${item.id}`)
                            .scrollBy({
                              left: document.getElementById(
                                `carousel-${item.id}`
                              ).clientWidth,
                              behavior: "smooth",
                            });
                        }}
                      >
                        <img src={rightIcon} alt="right icon" style={{ width: "30px", height: "30px",} }  />
                      </button>
                    </div>
                  </div>

                  {/* Selection button */}
                  <button
                    className={`mt-4 w-full py-2 rounded-lg text-center text-white font-semibold shadow transition-all ${
                      selectedItems.includes(item.id)
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-amber-300"
                    }`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    {selectedItems.includes(item.id)
                      ? "Unselect Item"
                      : colorSelection[item.id]
                      ? "Select Item"
                      : "Select Color First"}
                  </button>

                  {/* Comment Section */}
                  {selectedItems.includes(item.id) && (
                    <div className="mt-4">
                      <textarea
                        className="w-full h-12 bg-white p-2 border border-gray-300 rounded-sm"
                        placeholder="Leave a comment for this item..."
                        value={comments[item.id] || ""}
                        onChange={(e) =>
                          handleCommentChange(item.id, e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Full-screen Image Modal */}
      {fullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50 p-2">
          <div
            className="flex-1 flex justify-center items-center modal-overlay"
            onClick={(e) => {
              // Close only if clicking outside the image area
              if (e.target.classList.contains("modal-overlay")) {
                closeFullScreenImage();
              }
            }}
          >
            {/* Full-screen Image */}
            <img
              src={fullScreenImage}
              alt="Full Screen"
              className="h-full w-fit modal-image rounded-md"
            />

            {/* Close Button */}
            <button
              onClick={closeFullScreenImage}
              className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full focus:outline-none z-50"
            >
              ✕
            </button>
          </div>

          {/* Thumbnails Section */}
          <div className="absolute bottom-0 left-0 right-0 p-2  flex justify-center">
            <div className="flex overflow-x-auto space-x-2 p-2">
              {fullScreenImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 h-16 object-cover hover:border hover:border-red-600 cursor-pointer opacity-90 hover:opacity-100  shadow-black shadow-lg rounded-xl"
                  onMouseEnter={() => setFullScreenImage(image)} // Change full-screen image on hover
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit button, floating and visible only if items are selected */}
      {selectedCount > 0 && (
        <div className="fixed bottom-8 right-8">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md shadow-md"
            onClick={handleSubmitOrder}
          >
            Save
          </Button>
        </div>
      )}

      {/* Feedback Comment Box */}
      {selectedCount > 0 && (
        <div className="fixed w-1/2 bottom-1 right-1/4 modal-overlay">
          <textarea
            className="w-full h-16 bg-white p-2 border border-red-800 rounded-md"
            placeholder="Leave any additional feedback..."
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default ClientView;
