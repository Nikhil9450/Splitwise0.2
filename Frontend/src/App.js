import Signup from './Auth/Signup';
import SignIn from './Auth/SignIn';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivetRoute from './PrivetRoute';
import axios from 'axios';
import { useEffect,useState } from 'react';
function App() {
  const [isAuthenticated,setIsAuthenticated] = useState(null);
  useEffect(()=>{
    axios.get(" http://localhost:5000/checkAuth",{withCredentials: true})
    .then((res)=>{
        console.log(res.data)
        setIsAuthenticated(res.data.isAuthenticated)
    })
    .catch((err)=>{
        console.log(err);
        setIsAuthenticated(false);
    })
  },[])

  useEffect(()=>{
    console.log("isAuthenticated",isAuthenticated)
  })
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optional: show loader while checking auth
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
              path="/signup"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Signup />
              }
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
  );
}

export default App;
