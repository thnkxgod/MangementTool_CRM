import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const ProfilePage = ({ setAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem('token'); // Remove JWT from localStorage
    setAuthenticated(false); // Update authenticated state
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-[#f4f9fb] text-black rounded-lg shadow-lg p-6 w-80">
        <h2 className="font-bold text-xl mb-4">User Information</h2>
        <p className="mb-2">Name: Admin</p>
        <p className="mb-4">Email: Admin@company.com</p>

        {/* Close Button */}
        <Button
          className="mt-2 w-full bg-[#515151] text-white"
          onClick={() => window.history.back()}
        >
          Close
        </Button>

        {/* Logout Button */}
        <Button
          className="mt-2 w-full bg-red-500 text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

// Prop types validation
ProfilePage.propTypes = {
  setAuthenticated: PropTypes.func.isRequired,
};

export default ProfilePage;
