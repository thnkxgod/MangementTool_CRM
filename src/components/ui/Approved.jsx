
import { FaCheckCircle, FaSmile } from "react-icons/fa"; // Import icons

const Approved = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-red-400">
      <div className="text-center bg-white shadow-lg rounded-lg p-10 transform transition-transform hover:scale-105">
        <FaCheckCircle className="text-green-500 text-7xl mb-4 mx-auto" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Your order has been approved!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          We will process it shortly.
        </p>
        <FaSmile className="text-yellow-300 text-5xl mx-auto" />
      </div>
    </div>
  );
};

export default Approved;
