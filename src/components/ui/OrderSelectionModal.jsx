import { Button } from './button'; // Adjust this import according to your project structure
import { Input } from './input'; // Adjust this import according to your project structure
import PropTypes from 'prop-types';

const InventorySelectionModal = ({
  showInventory,
  setShowInventory,
  searchQuery,
  handleSearchChange,
  filteredInventory,
  handleSelectItem,
  selectedItems,
  generateDescription,
}) => {
  if (!showInventory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-gray-100 p-6 rounded-lg shadow-lg shadow-gray-500 max-w-2xl w-full">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={() => setShowInventory(false)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Select Items from Inventory</h2>
        <div className="flex justify-center">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Inventory"
            className="bg-gray-300 placeholder-gray-400 p-2 w-full rounded-lg mb-4"
          />
        </div>
        <div className="overflow-y-auto max-h-64">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInventory.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`p-4 border border-gray-600 rounded-lg cursor-pointer ${
                  selectedItems.some(selected => selected.id === item.id)
                    ? "bg-gray-300"
                    : "bg-gray-100"
                }`}
              >
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.pname}
                    className="h-20 w-20 object-cover mb-2 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500">No image available</p>
                )}
                <p className="font-bold text-gray-900">{item.pname}</p>
                <p className="text-sm text-gray-600">{item.dimension}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <Button
            onClick={generateDescription}
            className="px-4 py-2 rounded-lg transition duration-300 bg-blue-500 text-white"
          >
            Confirm Selection
          </Button>
          <Button
            onClick={() => setShowInventory(false)}
            className="px-4 py-2 rounded-lg transition duration-300 bg-gray-300"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for validation
InventorySelectionModal.propTypes = {
  showInventory: PropTypes.bool.isRequired,
  setShowInventory: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  filteredInventory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      pname: PropTypes.string.isRequired,
      dimension: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  generateDescription: PropTypes.func.isRequired,
};

export default InventorySelectionModal;
