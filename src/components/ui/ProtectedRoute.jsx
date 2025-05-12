
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ authenticated, children }) => {
  return authenticated ? children : <Navigate to="/login" />;
};

// Prop types validation
ProtectedRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
