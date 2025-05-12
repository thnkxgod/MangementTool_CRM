export const ColorList = ({ colors, selectedColors }) => {
    return (
      <div className="mt-4">
        <h3 className="font-bold">Colors:</h3>
        <ul className="flex">
          {selectedColors.map((colorId, index) => {
            const color = colors.find((c) => c.id === colorId);
            return <li key={index} className="mr-2">{color ? color.name : `Color ID: ${colorId}`}</li>;
          })}
        </ul>
      </div>
    );
  };
  