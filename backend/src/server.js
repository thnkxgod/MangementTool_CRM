import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";

import jwt from "jsonwebtoken"; // Import jsonwebtoken

import dotenv from "dotenv";
dotenv.config();


// Import the pg module as a default export
const { Pool } = pkg;

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


const app = express();
const SECRET_KEY = 'your_secret_key'; // Replace with your own secret key

app.use(cors());
app.use(bodyParser.json());

// Sample user data (replace this with a database call in a real application)
const users = [
  { id: 1, username: 'admin', password: 'password123' },
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Find user
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    // User found, generate JWT
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
    res.json({ token });
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from the Authorization header
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Save user info in request
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Protected route example
app.get('/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route');
});

// Endpoint to get hardcoded dimension data
app.get("/api/dimensions", (req, res) => {
  const dimensions = [
      "400x500",
      "700x1200",
      "1200x720",
      "800x600",
      "600x400"
  ];
  
  res.json(dimensions);
});

// API endpoint for inventory
app.get("/api/inventory", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).send("Server Error");
  }
});
// API endpoint for updating an inventory item by ID
app.put("/api/inventory/:id", async (req, res) => {
  const { id } = req.params;
  const item = req.body; // Get the updated item details from the request body

  try {
    const result = await pool.query(
      "UPDATE inventory SET pname = $1, color = $2, dimension = $3, description = $4, images = $5 WHERE id = $6 RETURNING *",
      [item.pname, item.color, item.dimension, item.description, item.images, id]
    );

    if (result.rows.length === 0) {
      // If no item is found with the given ID, return 404
      return res.status(404).send("Item not found");
    }

    res.json(result.rows[0]); // Return the updated item
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(500).send("Server Error");
  }
});


// API endpoint for fetching a single inventory item by ID
app.get("/api/inventory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM inventory WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      // If no item is found with the given ID, return 404
      return res.status(404).send("Item not found");
    }
    
    res.json(result.rows[0]); // Return the found item
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    res.status(500).send("Server Error");
  }
});


app.post("/api/inventory", async (req, res) => {
  const item = req.body;
  try {
    // Make sure to include all necessary fields
    const result = await pool.query(
      "INSERT INTO inventory (pname, color, dimension, description, images) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [item.pname, item.color, item.dimension, item.description, item.images]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/inventory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM inventory WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("Error removing inventory item:", error);
    res.status(500).send("Server Error");
  }
});

// API endpoint for colors
app.get("/api/colors", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM colors");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).send("Server Error");
  }
});

app.post("/api/colors", async (req, res) => {
  const color = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO colors (name, url) VALUES ($1, $2) RETURNING *",
      [color.name, color.url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding color:", error);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/colors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM colors WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("Error removing color:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).send("Server Error");
  }
});

app.post("/api/customers", async (req, res) => {
  const { name, email, phone_number, organization } = req.body; // Extract fields from request body

  // Validate input
  if (!name || !email || !phone_number || !organization) {
    return res.status(400).send("All fields are required."); // Send error response if validation fails
  }

  try {
    const newCustomer = await pool.query(
      "INSERT INTO customers (name, email, phone_number, organization) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone_number, organization]
    );
    res.status(201).json(newCustomer.rows[0]); // Respond with the newly created customer
  } catch (err) {
    console.error("Error adding customer:", err); // Log the error
    res.status(500).send("Server Error"); // Respond with a generic error
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  try {
    await pool.query("DELETE FROM customers WHERE id = $1", [id]); // Delete the customer
    res.status(204).send(); // Respond with no content
  } catch (error) {
    console.error("Error removing customer:", error);
    res.status(500).send("Server Error");
  }
});
// 1. GET all orders
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Server Error");
  }
});

// API endpoint to add a new order
app.post("/api/orders", async (req, res) => {
  const { customer_id, status, total_amount, order_description } = req.body; // Extract fields from request body
  try {
    const newOrder = await pool.query(
      "INSERT INTO orders (customer_id, status, total_amount, order_description) VALUES ($1, $2, $3, $4) RETURNING *",
      [customer_id, status, total_amount, order_description] // Insert values into the orders table
    );
    res.status(201).json(newOrder.rows[0]); // Return the newly created order
  } catch (err) {
    console.error("Error adding order:", err);
    res.status(500).send("Server Error");
  }
});

// API endpoint to delete an order by ID
app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params; // Extract the order ID from the request parameters
  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Order not found");
    }
    res.json({
      message: "Order deleted successfully",
      deletedOrder: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).send("Server Error");
  }
});

app.put("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status, order_description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1, order_description = $2 WHERE id = $3 RETURNING *",
      [status, order_description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Order not found");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).send("Order not found");
    }
    res.json(result.rows[0]);
    console.log(`Fetching order with id: ${id}`);
console.log(`Query Result: `, result.rows);

  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).send("Server Error");
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
