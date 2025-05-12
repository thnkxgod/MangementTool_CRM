import { Button } from "@/components/ui/button";

export const ColorOverlay = ({ colors, handleCloseOverlay }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-2">Available Colors</h2>
        <ul>
          {colors.map((color) => (
            <li key={color.id}>{color.name}</li>
          ))}
        </ul>
        <Button onClick={handleCloseOverlay} className="mt-4 bg-red-500 text-white">
          Close
        </Button>
      </div>
    </div>
  );
};
