import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "../redux/messageSlice";
import { socket } from "../socket/socket";

const useGetRealTimeMessage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      dispatch(addMessage(newMessage));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [dispatch]);
};

export default useGetRealTimeMessage;


