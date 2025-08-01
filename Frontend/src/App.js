import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/auth/authSlice';

import SignIn from './Auth/SignIn';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import AdminDashboard from './components/pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import Unaurthorize from './components/Unaurthorize';
import DrawerAppBar from './components/Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import Profile from './components/pages/Profile';
import FriendListContainer from './components/pages/FriendListContainer';
import Groups from './components/pages/groups';
import Balances from './components/pages/Balances';
function App() {
  const dispatch = useDispatch();
   const location = useLocation();
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (status === 'loading' || isAuthenticated === null) {
    return <div>Checking authentication...</div>;
  }

  return (
    <>
    {location.pathname !== '/signin' && <DrawerAppBar />}
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Home /> : <Navigate to="/signin" replace />
        }
      />
      <Route
        path="/profile"
        element={
          isAuthenticated ? <Profile /> : <Navigate to="/signin" replace />
        }
      />
      <Route
        path="/signin"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <SignIn />
        }
      />

      <Route
        path="/friends"
        element={
          // isAuthenticated ? <Navigate to="/friends" replace /> : <FriendListContainer />
          isAuthenticated ? <FriendListContainer /> : <Navigate to="/signin" replace />
        }
      />

      <Route
        path="/balances"
        element={
          // isAuthenticated ? <Navigate to="/balances" replace /> : <Balances />
          isAuthenticated ? <Balances /> : <Navigate to="/signin" replace />

        }
      />    

      <Route
        path="/groups"
        element={
          // isAuthenticated ? <Navigate to="/groups" replace /> : <Groups />
          isAuthenticated ? <Groups /> : <Navigate to="/signin" replace />

        }
      />               

      {/* Admin Routes (RBAC handled inside ProtectedRoute) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
      <Route path="/unaurthorize" element={<Unaurthorize/>} />
      
    </Routes>
    <ToastContainer />
    </>
  );
}

export default App;
