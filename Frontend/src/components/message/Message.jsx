import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Message.module.css";

const Message = ({ message, onImageClick }) => {
  const scrollRef = useRef();
  const { authUser } = useSelector((s) => s.user);
  const [displayImage, setDisplayImage] = useState(message.image);

  const isSent = authUser?._id === message.senderId;

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // 🔥 PRELOAD REAL IMAGE BEFORE SWAP
  useEffect(() => {
    if (!message.isTemp && message.image && message.image !== displayImage) {
      const img = new Image();
      img.src = message.image;

      img.onload = () => {
        setDisplayImage(message.image);
      };
    }
  }, [message.isTemp, message.image]);

  return (
    <div
      ref={scrollRef}
      className={`${styles.messageWrapper} ${isSent ? styles.sent : styles.received
        }`}
    >
      <div className={styles.message}>
        {displayImage && (
          <div className={styles.imageWrapper}>
            <img
              src={displayImage}
              className={`${styles.image} ${message.isTemp ? styles.blur : ""
                }`}
              alt=""
              onClick={() =>
                !message.isTemp && onImageClick(displayImage)
              }
            />

            {message.isTemp && (
              <div className={styles.sendingOverlay}>
                Sending…
              </div>
            )}
          </div>
        )}

        {message.message && <div>{message.message}</div>}
      </div>

      {!message.isTemp && (
        <div className={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </div>
      )}
    </div>
  );
};

export default Message;