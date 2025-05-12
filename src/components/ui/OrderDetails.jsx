import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './button';

const OrderDetails = () => {
  const { orderId } = useParams(); // Get the orderId from the URL params
  const [orderDetails, setOrderDetails] = useState(null); // State to hold order details
  const [error, setError] = useState(null); // State to hold any error messages
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Function to fetch order details based on orderId
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch order details: ${response.statusText}`);
        }
        const data = await response.json();
        setOrderDetails(data); // Set the fetched order details
      } catch (error) {
        console.error(error);
        setError(error.message); // Set the error message
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Fetch details when the orderId changes

  if (error) {
    return <div className="text-red-600">Error: {error}</div>; // Display any error messages
  }

  if (!orderDetails) {
    return <div>Loading...</div>; // Loading state while fetching
  }



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <p className="text-gray-600"><strong>Order ID:</strong> {orderDetails.id}</p>
      {/*   <p className="text-gray-600"><strong>Customer Name:</strong> {orderDetails.customer_name}</p> */}
        <p className="text-gray-600"><strong>Status:</strong> {orderDetails.status}</p>
        <p className="text-gray-600"><strong>Total Amount:</strong> ${orderDetails.total_amount}</p>
        <p className="text-gray-600"><strong>Description:</strong> {orderDetails.order_description}</p>
        <p className="text-gray-600"><strong>Created At:</strong> {new Date(orderDetails.created_at).toLocaleString()}</p>
        

        
        <Button 
          onClick={() => navigate(-1)} 
          className="mt-4 w-full font-semibold py-2 px-4 rounded shadow "
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
