import React, { useEffect, useState } from 'react';
import SignIn from './Auth/SignIn';
import axios from 'axios';

const PrivetRoute = ({ children }) => {
    const [isAuthenticated,setIsAuthenticated] = useState(null);
  useEffect(()=>{
    axios.get(" http://localhost:3000/check-auth",{withCredentials: true})
    .then((res)=>{
        console.log(res.data)
        setIsAuthenticated(res.data.authenticated)
    })
    .catch((err)=>{
        console.log(err);
        setIsAuthenticated(false);
    })
  },[])
  useEffect(()=>{
    console.log("isAuthenticated from useState------------>",isAuthenticated)
  },[isAuthenticated])

  if(isAuthenticated== null) return <div>Loading...</div>
  return isAuthenticated ? <>{children}</> : <SignIn />;

}

export default PrivetRoute