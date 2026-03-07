// src/socket/SocketManager.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "./socket.js";
import { setOnlineUsers } from "../redux/userSlice";

const SocketManager = () => {
  const { authUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authUser) return;

    // attach userId before connect
    socket.io.opts.query = {
      userId: authUser._id,
    };

    socket.connect();

    socket.on("getOnlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [authUser, dispatch]);

  useEffect(() => {
    if (!authUser) {
      socket.disconnect();
    }
  }, [authUser]);

  return null; // no UI
};

export default SocketManager;
