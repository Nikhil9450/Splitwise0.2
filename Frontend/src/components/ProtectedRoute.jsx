// src/components/ProtectedRoute.jsx
// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { isAuthenticated, userRole } = useSelector((state) => state.auth);

//   if (!isAuthenticated) {
//     return <Navigate to="/signin" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/unaurthorize" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, status } = useSelector((state) => state.auth);

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
