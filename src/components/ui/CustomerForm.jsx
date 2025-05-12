import { Button } from "./button";
import { Input } from "./input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    organization: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to add customer data to the API
  const addCustomer = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      return result; // Assuming the API returns some success flag or the created customer
    } catch (error) {
      console.error("Error adding customer:", error);
      return false; // Return false if there was an error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the addCustomer function to add customer to the database
    const success = await addCustomer(formData);

    if (success) {
      // Reset the form data if the customer was added successfully
      setFormData({ name: "", email: "", phone_number: "", organization: "" });
      navigate("/customers"); // Navigate back to the customers page
    } else {
      alert("Failed to add customer. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#f4f9fb] w-full p-6 rounded-lg shadow-lg max-w-2xl mx-auto space-y-7"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter customer name"
          required
          className="w-full p-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter customer email"
          required
          className="w-full p-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium mb-1">
          Phone Number
        </label>
        <Input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Enter phone number"
          required
          className="w-full p-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium mb-1">
          Organization
        </label>
        <Input
          type="text"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          placeholder="Enter organization"
          required
          className="w-full p-2 rounded-md"
        />
      </div>

      <Button type="submit" className="w-full p-2 rounded-md">
        Add Customer
      </Button>

      <Button
        type="button"
        onClick={() => navigate("/customers")}
        className="w-full bg-[#515151] mt-2 p-2 rounded-md"
      >
        Back to Customers
      </Button>
    </form>
  );
};

// Removed propTypes as addCustomer is now implemented within the component itself

export default CustomerForm;
