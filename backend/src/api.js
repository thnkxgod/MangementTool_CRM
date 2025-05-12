import axios from 'axios';

const API_URL_INVENTORY = 'http://localhost:3000/api/inventory'; // Adjust based on your server configuration
const API_URL_COLORS = 'http://localhost:3000/api/colors'; // API URL for colors
const API_URL_CUSTOMERS = 'http://localhost:3000/api/customers'; // API URL for customers
const API_URL_ORDERS = 'http://localhost:3000/api/orders'; 

// Inventory Functions

// Fetch all inventory items
export const fetchInventory = async () => {
  try {
    const response = await axios.get(API_URL_INVENTORY);
    return response.data; // Return the fetched inventory data
  } catch (error) {
    console.error('Error fetching inventory:', error); // Log any errors
    throw error; // Re-throw the error for further handling
  }
};

// Add a new inventory item
export const addInventoryItem = async (item) => {
  try {
    const response = await axios.post(API_URL_INVENTORY, item);
    return response.data; // Return the newly added inventory item
  } catch (error) {
    console.error('Error adding inventory item:', error); // Log any errors
    throw error; // Re-throw the error for further handling
  }
};

// Remove an inventory item by ID
export const removeInventoryItem = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_INVENTORY}/${id}`);
    return response.data; // Return the response confirming deletion
  } catch (error) {
    console.error('Error removing inventory item:', error); // Log any errors
    throw error; // Re-throw the error for further handling
  }
};

// Colors Functions

// Fetch all colors
export const fetchColors = async () => {
  try {
    const response = await axios.get(API_URL_COLORS);
    return response.data; // Return the fetched colors data
  } catch (error) {
    console.error('Error fetching colors:', error); // Log any errors
    throw error; // Re-throw the error for further handling
  }
};

// Add a new color
export const addColor = async (color) => {
  try {
    const response = await axios.post(API_URL_COLORS, color);
    return response.data; // Return the newly added color
  } catch (error) {
    console.error('Error adding color:', error); // Log any errors
    throw error; // Re-throw the error for further handling
  }
};

// Remove a color by ID
export const removeColor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_COLORS}/${id}`);
    return response.data; // Return the response confirming deletion
  } catch (error) {
    console.error('Error removing color:', error); // Log any errors
    throw error; // Re-throw the error for further handling
  }
}; 
export const fetchCustomers = async () => {
  try {
    const response = await axios.get(API_URL_CUSTOMERS);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Add a new customer
export const addCustomer = async (customer) => {
  try {
    const response = await axios.post(API_URL_CUSTOMERS, customer);
    return response.data;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

// Remove a customer by ID
export const removeCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_CUSTOMERS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error removing customer:', error);
    throw error;
  }
};

// Orders Functions

// Fetch all orders
export const fetchOrders = async () => {
  try {
    const response = await axios.get(API_URL_ORDERS);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Add a new order
export const addOrder = async (order) => {
  try {
    const response = await axios.post(API_URL_ORDERS, order);
    return response.data;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

// Remove an order by ID
export const removeOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_ORDERS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error removing order:', error);
    throw error;
  }
};
export const updateOrder = async (id, status, order_description) => {
  try {
    const response = await axios.put(`${API_URL_ORDERS}/${id}`, {
      status,
      order_description
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};