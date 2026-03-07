import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify";
import { setAuthUser } from "../../redux/userSlice"
import styles from "./EditProfile.module.css"

const EditProfile = () => {
  const { authUser } = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    about: "",
    password: "",
    profile: null,
  })

  const [profilePreview, setProfilePreview] = useState("/avatar.png")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Initialize form when user loads
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        about: authUser.about || "",
        password: "",
        profile: null,
      })
      setProfilePreview(authUser.profile || "/avatar.png")
    }
  }, [authUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, profile: file }))
      setProfilePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = new FormData()

      // ✅ append ONLY changed fields
      if (formData.name.trim() !== authUser?.name) {
        data.append("name", formData.name.trim())
      }

      if (formData.about.trim() !== authUser?.about) {
        data.append("about", formData.about.trim())
      }

      if (formData.password.trim()) {
        data.append("password", formData.password)
      }

      if (formData.profile) {
        data.append("profile", formData.profile)
      }

      // ❌ nothing changed
      if ([...data.entries()].length === 0) {
        setError("No changes made")
        setLoading(false)
        return
      }

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/edit-profile`,
        data,
        { withCredentials: true }
      )

      console.log(res)

      if (res.data.success) {
        toast.success(res?.data?.data?.message || "Profile updated successfully")
        dispatch(setAuthUser(res.data.data))
      } else {
        toast.error(res.data.message || "Failed to update profile")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Edit Profile</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Avatar */}
          <div className={styles.avatarSection}>
            <img
              src={profilePreview}
              alt="Profile"
              className={styles.avatar}
            />
            <label className={styles.uploadBtn}>
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Name */}
          <div className={styles.field}>
            <label>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email (read-only) */}
          <div className={styles.field}>
            <label>Email</label>
            <input
              value={authUser?.email || ""}
              disabled
              className={styles.disabled}
            />
          </div>

          {/* About */}
          <div className={styles.field}>
            <label>About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={styles.cancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.save}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default EditProfile
