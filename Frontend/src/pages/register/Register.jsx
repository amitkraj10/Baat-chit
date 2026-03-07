import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Register.module.css"
import { useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"
import axios from "axios"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profile, setProfile] = useState(null)
  const [progressBar, setProgressBar] = useState(false)
  const navigate = useNavigate()

  const handleProfileChange = (e) => {
    setProfile(e.target.files[0])
  }

  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!profile) {
      return
    }

    const objectUrl = URL.createObjectURL(profile)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [profile])

  const handleRegistration = async (e) => {
    setProgressBar(true)
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password.trim() || !profile) {
      toast.error("All fields are required")
      setProgressBar(false)
      return;
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("profile", profile)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData)
      toast.success(response?.data?.data?.message || "User register successfully");
      setName("")
      setEmail("")
      setPassword("")
      setProfile(null)
      setProgressBar(false)
    } catch (error) {
      setProgressBar(false)
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome to BaatChit</h2>
        <div className={styles.form}>
          {/* Fullname */}
          <label className={styles.label}>Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password*/}
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Profile upload */}
          <label className={styles.label}>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            className={styles.inputFile}
            onChange={handleProfileChange}
          />
          {previewUrl && (
            <div className={styles.previewWrapper}>
              <img
                src={previewUrl}
                alt="Profile Preview"
                className={styles.preview}
              />
            </div>
          )}

          <button type="submit" className={styles.button} onClick={handleRegistration}>
            Register
          </button>
        </div>

        {progressBar && (<Box sx={{ width: "100%", padding: "10px" }}><LinearProgress /></Box>)}

        {/* Footer for login redirect */}
        <div className={styles.footer}>
          <span>Already have an account? </span>
          <button className={styles.loginLink} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Register
