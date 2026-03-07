import React, { useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Chat from "../../components/chat/Chat.jsx";
import styles from "./Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers, setSelectedUser } from "../../redux/userSlice.js";
import { setMessages } from "../../redux/messageSlice.js";
import { setSocket } from "../../redux/socketSlice.js";
import io from "socket.io-client"
import AIChat from "../../components/aiChat/AIChat.jsx";
import {  deSelectAIChat, selectAIChat } from "../../redux/aiChatSlice.js";

const Home = () => {
 const {selectedUser} = useSelector(store => store.user)
 const {isAIChat} = useSelector(store => store.aiChat || { isAIChat: false })
  const dispatch = useDispatch()

  const handleSelectContact = (user) => {
    dispatch(deSelectAIChat())
    dispatch(setSelectedUser(user))
  };

  const handleChatWithAI = () => {
    dispatch(setSelectedUser(null))
    dispatch(selectAIChat())
  }

  const handleBack = () => {
    dispatch(setSelectedUser(null))
    dispatch(setMessages(null))
    dispatch(deSelectAIChat())
  }

  // const {authUser} = useSelector(state => state.user)
  // const {socket} = useSelector(store => store.socket)

  // useEffect(() => {
  //   if(authUser){
  //     const socketio = io('http://localhost:3000', {
  //       query: {
  //         userId: authUser._id,
  //       }
  //     })
  //     dispatch(setSocket(socketio))

  //     socketio?.on("getOnlineUsers", (onlineUsers) => {
  //       dispatch(setOnlineUsers(onlineUsers))
  //     })

  //     return () => socketio.close()
  //   }else{
  //     if(socket){
  //       socket.close()
  //       dispatch(setSocket(null))
  //     }
  //   }
  // }, [authUser])
  

  return (
      <div className={styles.container}>
      <div
        className={`${styles.sidebarWrapper} ${
          selectedUser || isAIChat ? styles.hideOnMobile : ""
        }`}
      >
        <Sidebar
          selectedChat={handleSelectContact}
          onChatWithAI={handleChatWithAI} // pass a prop to trigger AI chat
          onBack={handleBack}
        />
      </div>

      <div
        className={`${styles.chatWrapper} ${
          !selectedUser && !isAIChat ? styles.hideOnMobile : ""
        }`}
      >
        {isAIChat ? (
          <AIChat onBack={handleBack} />
        ) : selectedUser ? (
          <Chat onBack={handleBack} />
        ) : (
          <div className={styles.placeholder}>Select a contact to chat</div>
        )}
      </div>
    </div>
  );
};

export default Home;
