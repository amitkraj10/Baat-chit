import React, { useState } from "react";
import { CiLogout, CiHome } from "react-icons/ci";
import { BsChatDots, BsPeople, BsTelephone } from "react-icons/bs";
import { FaRegImage } from "react-icons/fa6";
import { AiOutlineCamera } from "react-icons/ai";
import { FaRobot } from "react-icons/fa6";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import useGetOtherUsers from "../../hooks/useGetOtherUsers";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from "../../redux/userSlice";
import { setMessages } from "../../redux/messageSlice";
import { clearAIChat } from "../../redux/aiChatSlice";

const Sidebar = ({ selectedChat, onBack, onChatWithAI }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNewMessage, setIsNewMessage] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  useGetOtherUsers()
  const { otherUsers, authUser, selectedUser, onlineUsers } = useSelector(store => store.user)
  const dispatch = useDispatch()

  if (!otherUsers || !authUser) return

  const handleLogOut = async (e) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, { withCredentials: true })
      .then((res) => {
        toast.success(res?.data?.data?.message || "LoggedOut Successfully")
        navigate("/login");
        dispatch(setAuthUser(null))
        dispatch(setOtherUsers(null))
        dispatch(setMessages(null))
        dispatch(setSelectedUser(null))
        dispatch(clearAIChat())
      })
      .catch((error) => {
        toast.error(error.message)
        console.log(error)
      })
  }

  const filteredUsers = otherUsers.filter((user) => user.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()))

  return (
    <div className={styles.sidebar}>
      {/* Top Section */}
      <div className={styles.topSection}>
        <input
          placeholder="Search or start new chat"
          className={styles.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.profileWrapper}>
          <button
            className={styles.profileButton}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <img
              src={authUser.profile}
              alt="Profile"
              className={styles.profileImage}
            />
          </button>

          {isDropdownOpen && (
            <ul className={styles.dropdown}>
              <li className={styles.dropdownItem} onClick={() => navigate("/edit-profile")}>
                <FaRegImage /> Edit Profile
              </li>
              <li className={styles.dropdownItem} onClick={onBack}>
                <CiHome /> Home
              </li>
              <li className={styles.dropdownItem} onClick={handleLogOut}>
                <CiLogout /> Logout
              </li>
              <li className={styles.dropdownItem} onClick={onChatWithAI}>
                <FaRobot />Ask to AI
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Contacts */}
      <div className={styles.contactsSection}>
        <h6 className={styles.contactsTitle}>Contacts</h6>
        <ul className={styles.contactList}>
          {filteredUsers.map((user) => (
            <li key={user._id} className={`${styles.contactItem} ${selectedUser?._id === user._id ? styles.selected : ""}`} onClick={() => selectedChat(user)}>
              <div className={styles.avatarWrapper}>
                <img src={user.profile} alt={user.name} className={styles.avatar} />
                {onlineUsers.includes(user._id) && <span className={styles.onlineDot}></span>}
              </div>
              <span className={styles.contactName}>{user.name}</span>
              {isNewMessage > 0 && (<span className={styles.unreadBadge}>+1</span>)}
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Bottom Navigation */}
      <div className={styles.bottomNav}>
        <button className={styles.navItem}>
          <BsChatDots />
          <span>Chats</span>
        </button>
        <button className={styles.navItem}>
          <AiOutlineCamera />
          <span>Status</span>
        </button>
        <button className={styles.navItem}>
          <BsPeople />
          <span>Groups</span>
        </button>
        <button className={styles.navItem}>
          <BsTelephone />
          <span>Calls</span>
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
