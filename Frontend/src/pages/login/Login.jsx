import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../redux/userSlice";

const Login = () => {
  const [loginField, setLoginField] = useState({ email: "", password: "" })
  const [progressBar, setProgressBar] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleOnChangeInput = (event, name) => {
    setLoginField({
      ...loginField,
      [name]: event.target.value,
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setProgressBar(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`,loginField,{ withCredentials: true })
      console.log(response?.data?.data)
      dispatch(setAuthUser(response?.data?.data?.user))
      toast.success(response?.data?.data?.message || "LoggedIn Successfully")
      setProgressBar(false)
      navigate("/")
    } catch (error) {
      setProgressBar(false)
      toast.error("Invalid Credentials")
      console.log("Error:", error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome to BaatChit</h2>
        <div className={styles.form}>
          {/* Email */}
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            placeholder="Enter your email"
            value={loginField.email}
            onChange={(e) => handleOnChangeInput(e, "email")}
          />

          {/* Password */}
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            placeholder="Enter your password"
            value={loginField.password}
            onChange={(e) => handleOnChangeInput(e, "password")}
          />

          {progressBar && ( <Box sx={{ width: "100%" , padding: "10px"}}> <LinearProgress /> </Box> )}

          <button type="submit" className={styles.button} onClick={handleLogin}>
            Login
          </button>
        </div>

        {/* Footer with register link */}
        <p className={styles.footerText}>
          Don't have an account?{" "}
          <span className={styles.footerLink} onClick={() => navigate("/register")} >
            Register
          </span>
        </p>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login;
