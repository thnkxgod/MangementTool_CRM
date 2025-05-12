export const ImageList = ({ images }) => {
    return (
      <div className="mt-4">
        <h3 className="font-bold">Images:</h3>
        <ul>
          {images.map((img, index) => (
            <li key={index}>{img}</li>
          ))}
        </ul>
      </div>
    );
  };
  