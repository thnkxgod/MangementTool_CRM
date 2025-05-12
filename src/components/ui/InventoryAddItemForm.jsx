import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "./button";

const InventoryAddItemForm = ({ mode, selectedColors }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [colors, setColors] = useState([]);
  const [itemData, setItemData] = useState({
    pname: "",
    color: selectedColors || [],
    dimension: "",
    description: "",
    images: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* Fetch colors */
  useEffect(() => {
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

    fetchColors();
  }, []);

  /* Fetch item data in edit mode */
  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchItemData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:3000/api/inventory/${id}`
          );
          setItemData(response.data);
        } catch {
          setError("Failed to fetch item data.");
        } finally {
          setLoading(false);
        }
      };

      fetchItemData();
    }
  }, [mode, id]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleAddImages = async () => {
    if (selectedFiles.length > 0) {
      try {
        setUploading(true);
        const uploadedImages = [];

        for (const file of selectedFiles) {
          const storageRef = ref(storage, `images/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          await new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              () => {},
              (error) => {
                setError("Failed to upload image.");
                setUploading(false);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                uploadedImages.push(downloadURL);
                resolve();
              }
            );
          });
        }
        setItemData((prevItem) => ({
          ...prevItem,
          images: [...prevItem.images, ...uploadedImages],
        }));
        setSelectedFiles([]);
        setUploading(false);
      } catch{
        setError("Failed to upload images.");
      }
    } else {
      setError("Please select at least one image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "add") {
        await axios.post("http://localhost:3000/api/inventory", {
          pname: itemData.pname,
          color:
            itemData.color.length > 0 ? JSON.stringify(itemData.color) : null,
          dimension: itemData.dimension,
          description: itemData.description,
          images:
            itemData.images.length > 0 ? JSON.stringify(itemData.images) : null,
        });
      } else if (mode === "edit" && id) {
        await axios.put(`http://localhost:3000/api/inventory/${id}`, {
          pname: itemData.pname,
          color:
            itemData.color.length > 0 ? JSON.stringify(itemData.color) : null,
          dimension: itemData.dimension,
          description: itemData.description,
          images:
            itemData.images.length > 0 ? JSON.stringify(itemData.images) : null,
        });
      }

      setItemData({
        pname: "",
        color: [],
        dimension: "",
        description: "",
        images: [],
      });
      navigate("/inventory");
    } catch  {
      setError("Failed to save inventory item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f4f9fb] p-6 m-4 rounded-lg shadow-lg w-full max-w-2xl relative h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4">
        {mode === "add" ? "Add New Item" : "Edit Item"}
      </h2>
      <div className="overflow-y-auto scrollbar-hide max-h-[500px]">
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <input
            type="text"
            name="pname"
            placeholder="Product Name"
            value={itemData.pname}
            onChange={handleChange}
            required
            className="border mb-3 p-3 w-full rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Select: Colors */}
          <select
            onChange={(e) => {
              const selectedColorId = e.target.value;
              if (selectedColorId) {
                setItemData((prevItem) => ({
                  ...prevItem,
                  color: [...prevItem.color, selectedColorId],
                }));
              }
            }}
            className="border mb-3 p-3 w-full rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a Color</option>
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>

          {/* Display selected colors */}
          {itemData.color.length > 0 && (
            <div className="my-4">
              <h3 className="font-bold">Colors:</h3>
              <ul className="flex">
                {itemData.color.map((colorId, index) => {
                  const color = colors.find((c) => c.id === colorId);
                  return (
                    <li key={index} className="mr-2">
                      {color ? color.name : `Color ID: ${colorId}`}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Dimension */}
          <input
            type="text"
            name="dimension"
            placeholder="Dimension"
            value={itemData.dimension}
            onChange={handleChange}
            required
            className="border mb-3 p-3 w-full rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={itemData.description}
            onChange={handleChange}
            required
            className="border mb-3 p-3 w-full rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* File input for images */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border mb-3 p-3 w-full rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Display uploaded images */}
          {itemData.images.length > 0 && (
            <div className="my-4">
              <h3 className="font-bold">Images:</h3>
              <ul className="grid grid-cols-12 gap-4">
                {itemData.images.map((img, index) => (
                  <li key={index}>
                    <img
                      src={img}
                      alt={`Image ${index}`}
                      className="w-7 h-7 object-cover rounded-lg shadow-md"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload Button */}
          <Button
            type="button"
            onClick={handleAddImages}
            className="rounded-lg"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>

          {/* Submit Button */}
          <Button type="submit" className="rounded-lg w-full mt-4">
            {mode === "add" ? "Add Item" : "Update Item"}
          </Button>

          <Button
            type="button"
            onClick={() => navigate("/inventory")}
            className="w-full mt-4 p-2 rounded-md bg-[#515151]"
          >
            Back to Inventory
          </Button>
        </form>
        {loading && <div className="rounded-md border border-red-500"></div>}
        {error && <div className="text-red-500 mt-3">{error}</div>}
      </div>
    </div>
  );
};

InventoryAddItemForm.propTypes = {
  mode: PropTypes.string.isRequired,
  selectedColors: PropTypes.array.isRequired,
};

export default InventoryAddItemForm;
