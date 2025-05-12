import axios from "axios";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { storage } from "../../firebaseConfig"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase storage functions

const InventoryColorOverlay = () => {
  const navigate = useNavigate();
  const [newColorName, setNewColorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [colors, setColors] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const fetchColors = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/colors");
        setColors(response.data);
      } catch (error) {
        setError("Failed to load colors.");
        console.error(error); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  const handleFileChange = (e) => {
    // Get the file selected by the user
    setSelectedFile(e.target.files[0]);
  };

  const handleAddNewColor = async () => {
    if (newColorName && selectedFile) {
      try {
        setUploading(true);
        // Step 1: Upload file to Firebase Storage
        const storageRef = ref(storage, `colors/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on(
          "state_changed",
          () => {
            // Optional: Handle progress (e.g., display percentage)
          },
          () => {
            setError("Failed to upload image.");
            setUploading(false);
          },
          async () => {
            // Step 2: Get download URL after upload completes
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Step 3: Send data to the backend
            const formData = {
              name: newColorName,
              url: downloadURL,
            };

            await axios.post("http://localhost:3000/api/colors", formData);

            // Fetch colors again after adding a new one
            const response = await axios.get(
              "http://localhost:3000/api/colors"
            );
            setColors(response.data);
            setNewColorName("");
            setSelectedFile(null);
            setUploading(false);
          }
        );
      } catch {
        setError("Failed to add new color.");
        setUploading(false);
      }
    } else {
      setError("Please provide both color name and select a file.");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message
  }

  if (error) {
    return <div className="text-red-600">{error}</div>; // Display error messages
  }

  return (
    <div className=" flex items-center justify-center p-0">
      <div className="bg-[#f4f9fb] p-6 rounded-lg shadow-lg w-full max-w-2xl space-x-2 h-full scrollbar-hide overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">Available Colors</h2>
        <div className="mt-4 ">
          <h3 className="font-bold">Colors:</h3>

          <ul className="flex flex-wrap mt-4 container max-h-64 overflow-y-auto scrollbar-hide border border-gray-300 p-4">
            {colors.map((color) => (
              <li key={color.id} className="m-2 relative">
                <div className="flex items-center justify-center">
                  <img
                    src={color.url}
                    alt={color.name}
                    className="w-10 h-10 object-cover"
                  />
                  <p className="ml-2">{color.name}</p>{" "}
                </div>

                {deleteMode && (
                  <button
                    onClick={async () => {
                      const confirmed = window.confirm(
                        `Are you sure you want to delete ${color.name}?`
                      );
                      if (confirmed) {
                        await axios.delete(
                          `http://localhost:3000/api/colors/${color.id}`
                        );
                        setColors((prevColors) =>
                          prevColors.filter((c) => c.id !== color.id)
                        );
                      }
                    }}
                    className="absolute top-0 right-0 bg-red-600 rounded-full p-1"
                  >
                    🗑️
                  </button>
                )}
              </li>
            ))}
          </ul>

        </div>
        <Button
          onClick={() => setDeleteMode((prev) => !prev)}
          className="w-full mt-4 p-2 rounded-md bg-gray-300 hover:bg-gray-400"
        >
          <FontAwesomeIcon
            icon={faTrashAlt}
            className={`text-red-500 hover:text-red-800 cursor-pointer size-5`}
          />
        </Button>

        {/* Add new color input */}
        <div className="mt-4">
          <input
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            placeholder="Color Name"
            className="border mb-2 p-2 w-full rounded-lg bg-white text-black focus:outline-none focus:ring-1 "
          />

          {/* File input to select an image */}
          <input
            type="file"
            onChange={handleFileChange}
            className="border mb-2 p-2 w-full rounded-md bg-white text-black focus:outline-none "
          />

          <Button
            onClick={handleAddNewColor}
            className="w-full mt-4 p-2 rounded-md "
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add New Color"}
          </Button>
          <Button
          type="button"
          onClick={() => navigate("/inventory")}
          className="w-full mt-4 p-2 rounded-md bg-[#515151]"
        >
          Back to Inventory
        </Button>
        </div>

        {error && <div className="text-red-500 mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default InventoryColorOverlay;
