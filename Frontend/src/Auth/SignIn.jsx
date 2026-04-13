import React, { useRef, useState } from 'react';
import styles from './SignIn.module.css';
import axios from 'axios';
import Home from '../components/pages/Home';
import { ToastContainer, toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../redux/auth/authSlice';
import { motion, AnimatePresence } from "framer-motion";

const SignIn = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const NameRef = useRef(null);
  const ConfirmPasswordRef = useRef(null);

  const [redirectToHome, setRedirectToHome] = useState(false);
  const [registerUser, setRegisterUser] = useState(false);

  const dispatch = useDispatch();

  // 🔥 Animation Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const signupHandler = async () => {
    const email = emailRef.current.value;
    const name = NameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = ConfirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/user", {
        email,
        name,
        password
      });

      toast.success("User Registered Successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  const loginHandler = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post(
        "http://localhost:5000/user/UserSignIn",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.loggedIn) {
        setRedirectToHome(true);
        dispatch(checkAuth());
      }
    } catch (error) {
      toast.error(error?.response?.data.error || "server not started.");
    }
  };

  if (redirectToHome) return <Home />;

  return (
    <div className={styles.container}>

      {/* 🔥 CARD ENTRY */}
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* LEFT SIDE */}
        <div className={styles.left}>

          <AnimatePresence mode="wait">

            {/* 🔥 SWITCH ANIMATION */}
            <motion.div
              key={registerUser ? "signup" : "login"}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >

              <motion.h1
                className={styles.heading}
                variants={fieldVariants}
              >
                {registerUser ? "Welcome." : "Welcome back."}
              </motion.h1>

              {registerUser && (
                <motion.div className={styles.field} variants={fieldVariants}>
                  <label>Full Name</label>
                  <input ref={NameRef} type="text" placeholder="Full Name" />
                </motion.div>
              )}

              <motion.div className={styles.field} variants={fieldVariants}>
                <label>Email</label>
                <input ref={emailRef} type="email" placeholder="example@email.com" />
              </motion.div>

              <motion.div className={styles.field} variants={fieldVariants}>
                <label>Password</label>
                <input ref={passwordRef} type="password" placeholder="Password" />
              </motion.div>

              {registerUser && (
                <motion.div className={styles.field} variants={fieldVariants}>
                  <label>Confirm Password</label>
                  <input ref={ConfirmPasswordRef} type="password" placeholder="Confirm Password" />
                </motion.div>
              )}

              {/* 🔥 BUTTON MICRO INTERACTION */}
              <motion.button
                className={styles.primaryBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={registerUser ? signupHandler : loginHandler}
              >
                {registerUser ? "Sign Up" : "Sign In"}
              </motion.button>

              <motion.div className={styles.divider} variants={fieldVariants}>
                <span>Or continue with</span>
              </motion.div>

              <motion.div className={styles.googleWrapper} variants={fieldVariants}>
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const response = await axios.post(
                        "http://localhost:5000/user/googleAuth",
                        { token: credentialResponse.credential },
                        { withCredentials: true }
                      );

                      if (response.data.loggedIn) {
                        setRedirectToHome(true);
                        dispatch(checkAuth());
                      }
                    } catch (error) {
                      toast.error(error.response.data.message);
                    }
                  }}
                  onError={() => console.log("Login Failed")}
                />
              </motion.div>

              <motion.p className={styles.switchText} variants={fieldVariants}>
                {registerUser ? "Already registered?" : "New here?"}
                <span onClick={() => setRegisterUser(!registerUser)}>
                  {registerUser ? " Sign In" : " Create account"}
                </span>
              </motion.p>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* 🔥 RIGHT PANEL ANIMATION */}
        <motion.div
          className={styles.right}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.overlay}>
            <h2>Split Smart</h2>
            <p>Track. Split. Chill.</p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default SignIn;