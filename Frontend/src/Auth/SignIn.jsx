import React, { useRef, useState } from 'react';
import styles from './SignIn.module.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Home from '../components/pages/Home';
const SignIn = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [redirectToHome, setRedirectToHome] = useState(false);

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
          <div className={styles.field}>
            <h1>Hello<br/>Welcome back.</h1>
          </div>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input type="email" name="email" className={styles.input} ref={emailRef} placeholder='example@email.com'/>
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input type="password" name="password" className={styles.input} ref={passwordRef} placeholder='password'/>
          </div>
          <div className={styles.field}>
            <button className={styles.button} onClick={loginHandler}>Login</button>
          </div>
          <div className={styles.line}>
            <hr />
            <label className={styles.text}>Or Login With</label>
            <hr/>
          </div>
          <div className={styles.field}>
            <button className={styles.google_button} onClick={loginHandler}><span><img className={styles.google_icon} src="/icons/Google.svg" alt="Logo" /></span>Google</button>
          </div>
    </div>
    <div className={styles.right_container}>

    </div>

    </div>
  );
};

export default SignIn;
