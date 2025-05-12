import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/ui/Sidebar";
import Navbar from "./components/ui/Navbar";
import DashboardContent from "./components/ui/DashboardContent";
import OrdersContent from "./components/ui/OrdersContent";
import CustomersContent from "./components/ui/CustomersContent";
import CustomerForm from "./components/ui/CustomerForm";
import InventoryContent from "./components/ui/InventoryContent";
import SettingsContent from "./components/ui/SettingsContent";
import Login from "./components/ui/Login";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import ClientView from "./components/ui/ClientView";
import InventoryAddItemForm from "./components/ui/InventoryAddItemForm";
import InventoryColorOverlay from "./components/ui/InventoryColorOverlay";
import ProfilePage from "./components/ui/Profile";
import PropTypes from "prop-types";
import OrderDetails from "./components/ui/OrderDetails";
import Approved from "./components/ui/Approved";
import ClientViewV2 from "./components/ui/ClientViewV2";
import ClientViewV3 from "./components/ui/ClientViewV3";
import ClientViewV4 from "./components/ui/ClientViewV4";
import ClientViewV5 from "./components/ui/ClientViewV5";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState([]); // State for selected colors

  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp; // Check if the current time is past the expiration time
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !isTokenExpired(token)) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      localStorage.removeItem("token");
    }

    setLoading(false);
  }, []);

  const handleColorSelection = (colors) => {
    setSelectedColors(colors); // Update selected colors
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login setAuthenticated={setAuthenticated} />}
        />
        <Route path="/order/v2/:id" element={<ClientViewV2 />} />
        <Route path="/order/v1/:id" element={<ClientView />} />
        <Route path="/order/v3/:id" element={<ClientViewV3 />} />
        <Route path="/order/v4/:id" element={<ClientViewV4 />} />
        <Route path="/order/v5/:id" element={<ClientViewV5 />} />
        <Route path="/approved" element={<Approved />} />
        <Route
          path="/"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <MainApp
                setAuthenticated={setAuthenticated}
                selectedColors={selectedColors}
                handleColorSelection={handleColorSelection}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="orders" element={<OrdersContent />} />

          <Route path="customers" element={<CustomersContent />} />
          <Route path="customers/form" element={<CustomerForm />} />
          <Route path="inventory" element={<InventoryContent />} />
          <Route path="settings" element={<SettingsContent />} />
          <Route
            path="/inventory/form"
            element={
              <InventoryAddItemForm
                mode="add"
                selectedColors={selectedColors}
              />
            }
          />
          <Route
            path="/inventory/edit/:id"
            element={
              <InventoryAddItemForm
                mode="edit"
                selectedColors={selectedColors}
              />
            }
          />
          <Route
            path="profile"
            element={<ProfilePage setAuthenticated={setAuthenticated} />}
          />
          <Route
            path="inventory/texture"
            element={
              <InventoryColorOverlay onSelectColors={handleColorSelection} />
            }
          />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Route>
        <Route
          path="*"
          element={
            authenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

const MainApp = ({
  setAuthenticated,
  selectedColors,
  handleColorSelection,
}) => (
  <div className="flex max-h-screen bg-background text-foreground">
    
    <Sidebar />
    <div className="flex-1 flex flex-col bg-card bg-gradient-to-r from-[#ffffff] via-[#effaef] to-[#ffffff]">
      <Navbar />
      <div className="flex-1 flex justify-center p-4 overflow-auto scrollbar-hide">
        <Routes>
          <Route path="/dashboard" element={<DashboardContent />} />
          <Route path="/orders" element={<OrdersContent />} />
          <Route path="/customers" element={<CustomersContent />} />
          <Route path="/customers/form" element={<CustomerForm />} />
          <Route path="/inventory" element={<InventoryContent />} />
          <Route
            path="/inventory/form"
            element={
              <InventoryAddItemForm
                mode="add"
                selectedColors={selectedColors}
              />
            }
          />
          <Route
            path="/inventory/edit/:id"
            element={
              <InventoryAddItemForm
                mode="edit"
                selectedColors={selectedColors}
              />
            }
          />
          <Route path="/settings" element={<SettingsContent />} />
          <Route
            path="/profile"
            element={<ProfilePage setAuthenticated={setAuthenticated} />}
          />
          <Route
            path="/inventory/texture"
            element={
              <InventoryColorOverlay onSelectColors={handleColorSelection} />
            }
          />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Routes>
      </div>
      
    </div>
  </div>
);

// Prop types validation for MainApp
MainApp.propTypes = {
  setAuthenticated: PropTypes.func.isRequired,
  selectedColors: PropTypes.array.isRequired,
  handleColorSelection: PropTypes.func.isRequired,
};

export default App;
