import React, { useState } from "react";
import {
  MdOutlineKeyboardBackspace,
  MdSend,
  MdCall,
  MdVideocam,
  MdMoreVert,
  MdEmojiEmotions,
  MdAttachFile,
} from "react-icons/md";
import styles from "./Chat.module.css";
import Message from "../message/Message";
import useGetMessages from "../../hooks/useGetMessages";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addMessage, replaceMessage } from "../../redux/messageSlice";
import useGetRealTimeMessage from "../../hooks/useGetRealTimeMessage";

const Chat = ({ onBack }) => {
  const { messages } = useSelector((store) => store.message);
  const { selectedUser, onlineUsers, authUser } = useSelector(
    (store) => store.user,
  );
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fullscreen image preview
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch messages
  useGetMessages();
  useGetRealTimeMessage();
  if (!messages) return null;

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim() && !selectedFile) return;
    if (!selectedUser?._id) return;

    const tempId = Date.now();

    // Create blob URL for instant preview
    const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

    // Temp message
    const tempMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      message: input.trim() || "",
      image: previewUrl,
      createdAt: new Date().toISOString(),
      isTemp: true,
      realImageLoaded: false,
    };

    // Show instantly
    dispatch(addMessage(tempMessage));

    // Clear input immediately
    setInput("");
    setSelectedFile(null);
    setPreview(null);

    try {
      const formData = new FormData();
      if (tempMessage.message) formData.append("message", tempMessage.message);
      if (selectedFile) formData.append("image", selectedFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/messages/send/${selectedUser._id}`,
        formData,
        { withCredentials: true },
      );

      // Replace temp with real message
      dispatch(
        replaceMessage({
          tempId,
          newMessage: res.data.data,
        }),
      );

      // Clean up blob memory
      // if (previewUrl) URL.revokeObjectURL(previewUrl);
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          <button className={styles.backButton} onClick={onBack}>
            <MdOutlineKeyboardBackspace />
          </button>
          <img
            src={selectedUser.profile}
            alt={selectedUser.name}
            className={styles.profileImage}
          />
          <div className={styles.contactInfo}>
            <h3 className={styles.contactName}>{selectedUser.name}</h3>
            <span className={styles.lastSeen}>
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div className={styles.rightHeader}>
          <button className={styles.iconButton}>
            <MdCall />
          </button>
          <button className={styles.iconButton}>
            <MdVideocam />
          </button>
          <button className={styles.iconButton}>
            <MdMoreVert />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} onImageClick={setPreviewImage} />
        ))}
      </div>

      {/* Preview before sending */}
      {preview && (
        <div className={styles.previewContainer}>
          <img src={preview} alt="preview" className={styles.previewImage} />
          <button className={styles.removePreview} onClick={removeSelectedFile}>
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className={styles.inputWrapper}>
        <button className={styles.iconCircle}>
          <MdEmojiEmotions />
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />

        <label className={styles.iconCircle}>
          <MdAttachFile />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </label>

        <button onClick={onSubmitHandler} className={styles.iconCircle}>
          <MdSend />
        </button>
      </div>

      {/* Fullscreen image preview modal */}
      {previewImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            style={{ maxHeight: "90%", maxWidth: "90%", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
