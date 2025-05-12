import PropTypes from "prop-types";
import Slider from "react-slick";
import { Button } from "./button"; // Adjust the path based on your project structure
import { useState } from "react";

const ItemDetailPopup = ({ selectedItem, colors, handleCloseDetail, sliderSettings }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // Track current slide index
  let sliderRef = null;

  const handleNext = () => {
    if (sliderRef) {
      sliderRef.slickNext();
    }
  };

  const handlePrev = () => {
    if (sliderRef) {
      sliderRef.slickPrev();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold">{selectedItem.pname}</h2>
        {selectedItem.images && selectedItem.images.length > 0 ? (
          <div className="relative">
            {selectedItem.images.length > 1 ? (
              <>
                <Slider
                  {...sliderSettings}
                  ref={(slider) => (sliderRef = slider)}
                  afterChange={(index) => setCurrentSlide(index)}
                >
                  {selectedItem.images.map((img, index) => (
                    <div key={index}>
                      <img
                        src={img}
                        alt={selectedItem.pname}
                        className="mb-4 w-full object-cover max-h-96"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </Slider>
                <div className="absolute inset-0 flex justify-between items-center px-1">
                  <Button onClick={handlePrev} className="bg-white text-black bg-opacity-15 hover:bg-white">
                    Previous
                  </Button>
                  <Button onClick={handleNext} className="bg-white text-black bg-opacity-15 hover:bg-white">
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <img
                src={selectedItem.images[0]}
                alt={selectedItem.pname}
                className="mb-4 w-full object-cover max-h-96"
                loading="lazy"
              />
            )}
          </div>
        ) : null}
        <ul className="flex">
          {selectedItem.color && selectedItem.color.length > 0 ? (
            selectedItem.color.map((colorId, index) => {
              const color = colors.find((c) => c.id === Number(colorId));
              return (
                <li key={index} className="mr-4 flex flex-col items-center">
                  {color ? (
                    <>
                      <img
                        src={color.url}
                        alt={color.name}
                        className="w-10 h-10 rounded-full mb-1"
                      />
                      <span className="text-center">{color.name}</span>
                    </>
                  ) : (
                    <span>Color ID: {colorId} (not found)</span>
                  )}
                </li>
              );
            })
          ) : (
            <li>No colors available</li>
          )}
        </ul>
        <p>
          <strong>Dimension:</strong> {selectedItem.dimension}
        </p>
        <p>
          <strong>Description:</strong> {selectedItem.description}
        </p>
        <Button onClick={handleCloseDetail} className="mt-4 bg-red-500 text-white">
          Close
        </Button>
      </div>
    </div>
  );
};

ItemDetailPopup.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  colors: PropTypes.array.isRequired,
  handleCloseDetail: PropTypes.func.isRequired,
  sliderSettings: PropTypes.object, // Optional slider settings
};

export default ItemDetailPopup;
