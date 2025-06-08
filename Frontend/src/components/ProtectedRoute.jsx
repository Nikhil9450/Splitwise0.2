import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, status } = useSelector((state) => state.auth);

  console.log("isAuthenticated-------->",isAuthenticated);
  console.log("userRole---------->",userRole);
  console.log("status------->",status);
  if (status === 'loading' || isAuthenticated === null) {
    return <div>Checking authentication...</div>; // or a loader
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unaurthorize" replace />;
  }

  return children;
};

export default ProtectedRoute;
