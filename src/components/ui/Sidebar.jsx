import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Icons } from "@/components/ui/icons.jsx";
import burgericon from "../../assets/icons/sidebar.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();

  // Function to check if the route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`relative bg-gradient-to-b from-[#daeef5] via-[#f2efff] to-[#ffffff] h-screen border-black border-r-2 ${
        isMinimized ? "w-20" : "w-60"
      } transition-width duration-500 ease-in-out overflow-visible`}
    >
      {/* Toggle Button */}
      <img
        src={isMinimized ? burgericon : closeIcon}
        alt="Toggle Sidebar"
        className={`absolute  cursor-pointer z-50 transition-all duration-300 transform ${
          isMinimized ? "top-5 left-1/2 -translate-x-1/2 w-6 h-6" : "top-5 right-5 w-5 h-4"
        } hover:scale-110`}
        onClick={() => setIsMinimized(!isMinimized)}
      />

      <div className="pt-28 h-full">
        <ul className="mt-10 font-semibold">
          {/* Dashboard */}
          <li
            className={`py-5 pl-6 transition-colors duration-300 ease-in-out ${
              isActive("/dashboard") ? "bg-gray-400" : "hover:bg-gray-200"
            }`}
          >
            <Link to="/dashboard" className="flex items-center">
              <Icons.Home className="text-xl" />
              <span
                className={`ml-4 transition-opacity duration-500 ease-in-out ${
                  isMinimized ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
              >
                Dashboard
              </span>
            </Link>
          </li>

          {/* Orders */}
          <li
            className={`py-5 pl-6 transition-colors duration-300 ease-in-out ${
              isActive("/orders") ? "bg-gray-400" : "hover:bg-gray-200"
            }`}
          >
            <Link to="/orders" className="flex items-center">
              <Icons.Orders className="text-xl" />
              <span
                className={`ml-4 transition-opacity duration-500 ease-in-out ${
                  isMinimized ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
              >
                Orders
              </span>
            </Link>
          </li>

          {/* Customers */}
          <li
            className={`py-5 pl-6 transition-colors duration-300 ease-in-out ${
              isActive("/customers") ? "bg-gray-400" : "hover:bg-gray-200"
            }`}
          >
            <Link to="/customers" className="flex items-center">
              <Icons.Customers className="text-xl" />
              <span
                className={`ml-4 transition-opacity duration-500 ease-in-out ${
                  isMinimized ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
              >
                Customers
              </span>
            </Link>
          </li>

          {/* Inventory */}
          <li
            className={`py-5 pl-6 transition-colors duration-300 ease-in-out ${
              isActive("/inventory") ? "bg-gray-400" : "hover:bg-gray-200"
            }`}
          >
            <Link to="/inventory" className="flex items-center">
              <Icons.Inventory className="text-xl" />
              <span
                className={`ml-4 transition-opacity duration-500 ease-in-out ${
                  isMinimized ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
              >
                Inventory
              </span>
            </Link>
          </li>

          {/* Settings */}
          <li
            className={`py-5 pl-6 transition-colors duration-300 ease-in-out ${
              isActive("/settings") ? "bg-gray-400" : "hover:bg-gray-200"
            }`}
          >
            <Link to="/settings" className="flex items-center">
              <Icons.Settings className="text-xl" />
              <span
                className={`ml-4 transition-opacity duration-500 ease-in-out ${
                  isMinimized ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
              >
                Settings
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
