import React, { useRef } from 'react';
import styles from './Signup.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Signup = () => {
  const emailRef = useRef(null);
  const NameRef = useRef(null);
  const PasswordRef = useRef(null);

  const signupHandler=async()=>{
    const email = emailRef.current.value;
    const name = NameRef.current.value;
    const password = PasswordRef.current.value;
    await axios.post("http://localhost:5000/user",
      {
        email,
        name,
        password
      }
    )
    .then((res)=>console.log(res.data))
    .catch((err)=>console.log(err))
  }
  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>Full Name</label>
        <input type="text" name="name" className={styles.input} ref={NameRef}/>
      </div>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input type="email" name="email" className={styles.input} ref={emailRef} />
      </div>
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input type="password" name="password" className={styles.input}  ref={PasswordRef}/>
      </div>
      <div className={styles.field}>
        <button className={styles.button} onClick={signupHandler}>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
