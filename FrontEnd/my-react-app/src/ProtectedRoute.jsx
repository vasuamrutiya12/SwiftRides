import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles, userRole }) => {
  if (!allowedRoles.includes(userRole)) {
    console.log(allowedRoles, userRole)
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
