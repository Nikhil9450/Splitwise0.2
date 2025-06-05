import SignIn from './Auth/SignIn';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import { useDispatch,useSelector } from 'react-redux';
import { checkAuth } from './redux/auth/authSlice';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminDashboard from './components/pages/AdminDashboard';
function App() {
  const dispatch = useDispatch();
  const {isAuthenticated,status} = useSelector((state)=>state.auth)
  useEffect(()=>{
    dispatch(checkAuth());
  },[])

  if (status === null || isAuthenticated===null) {
    return <div>Checking authentication...</div>; 
  }
  return (
    <div className="App">
          <Routes>
            {/* Protected Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Home /> : <Navigate to="/signin" replace />
              }
            />
            
            {/* Public Routes */}
            <Route
              path="/signin"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <SignIn />
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Navigate to="/"  /> : <AdminDashboard />
              }
            />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
  );
}

export default App;
