import React, { useEffect, useRef, useState } from 'react';
import styles from './SignIn.module.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Home from '../components/pages/Home';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const SignIn = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const NameRef = useRef(null);
  const ConfirmPasswordRef = useRef(null);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [registerUser,setRegisterUser]=useState(false);




  const signupHandler=async()=>{
    const email = emailRef.current.value;
    const name = NameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = ConfirmPasswordRef.current.value;
    await axios.post("http://localhost:5000/user",
      {
        email,
        name,
        password
      }
    )
    .then((res)=>{
      console.log(res.data)
       toast.success("User Registered Successfully"); 
    })
    .catch((err)=>{
      console.log(err)
      toast.error("Some error occured.");
    })
  }


  const loginHandler = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    console.log("email---->", email);
    console.log("password-------->", password);
    try {
      const response = await axios.post("http://localhost:5000/user/UserSignIn", {
        email,
        password
      }, {
        withCredentials: true
      });

      console.log('request submitted', response);

      if (response.data.loggedIn) {
        setRedirectToHome(true);  // trigger navigation
      }
    } catch (error) {
      console.log("Error posting data", error);
    }
  };

  // ✅ Trigger navigation on successful login
  if (redirectToHome) {
    return <Home/>;
  }

  return (
    <div className={styles.container}>
    <div className={styles.left_container}>
          {registerUser ?"":""}
          <div className={styles.field}>
            {registerUser 
              ?<h1>Hello<br/>Welcome.</h1>
              :<h1>Hello<br/>Welcome back.</h1>
            }
          </div>
          {registerUser ?
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Full Name</label>
            <input type="text" name="name" className={styles.input} ref={NameRef} placeholder='Full Name'/>
          </div>
          :""}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input type="email" name="email" className={styles.input} ref={emailRef} placeholder='example@email.com'/>
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input type="password" name="password" className={styles.input} ref={passwordRef} placeholder='Password'/>
          </div>
           {registerUser
            ? <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <input type="password" name="confirmPassword" className={styles.input} ref={ConfirmPasswordRef} placeholder='Confirm Password'/>
              </div> :""}
          <div className={styles.field}>
            {registerUser
              ? <button className={styles.button} onClick={signupHandler}>Sign Up</button>
              : <button className={styles.button} onClick={loginHandler}>Sign In</button>
            }
          </div>
          <div className={styles.line}>
            <hr />
            <label className={styles.text}>Or Login With</label>
            <hr/>
          </div>
          <div className={styles.field}>
            <button className={styles.google_button} onClick={loginHandler}><span><img className={styles.google_icon} src="/icons/Google.svg" alt="Logo" /></span>Google</button>
          </div>
          <div >
            {
              registerUser ? (
                <a href="#" onClick={(e) => { e.preventDefault(); setRegisterUser(false); }}>
                  Already registered
                </a>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); setRegisterUser(true); }}>
                  Register here
                </a>
              )
            }
          </div>
    </div>
    <div className={styles.right_container}>

    </div>
    <ToastContainer />
    </div>
  );
};

export default SignIn;
