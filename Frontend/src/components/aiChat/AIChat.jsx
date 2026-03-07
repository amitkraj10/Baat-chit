import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
    MdOutlineKeyboardBackspace,
    MdSend,
    MdEmojiEmotions,
} from "react-icons/md";
import styles from "./AIChat.module.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addAIMessage } from "../../redux/aiChatSlice";
import { useEffect, useRef } from "react";
import aiLogo from "../../../src/assets/aiLogo.png"

const AIChat = ({ onBack }) => {
    const dispatch = useDispatch();
    const { aiMessages } = useSelector((store) => store.aiChat);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages, loading]);


    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: "user",
            text: input.trim(),
        };

        dispatch(addAIMessage(userMessage));
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/ai/chat`,
                {
                    history: [...aiMessages, userMessage],
                },
                { withCredentials: true }
            );

            dispatch(
                addAIMessage({
                    id: Date.now() + 1,
                    role: "ai",
                    text: res?.data?.data,
                })
            );
        } catch (err) {
            dispatch(
                addAIMessage({
                    id: Date.now() + 2,
                    role: "ai",
                    text: "⚠️ Something went wrong. Please try again.",
                })
            );
        } finally {
            setLoading(false);
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
                        src={aiLogo}
                        className={styles.profileImage}
                    />

                    <div className={styles.contactInfo}>
                        <h3 className={styles.contactName}>BaatChit AI</h3>
                        <span className={styles.lastSeen}>Online</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
                {aiMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={
                            msg.role === "user"
                                ? styles.userMessage
                                : styles.aiMessage
                        }
                    >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                ))}

                {loading && (
                    <div className={styles.aiMessage}>Searching……</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className={styles.inputWrapper} onSubmit={sendMessage}>
                <button type="button" className={styles.iconCircle}>
                    <MdEmojiEmotions />
                </button>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI something..."
                    disabled={loading}
                />

                <button type="submit" className={styles.iconCircle}>
                    <MdSend />
                </button>
            </form>
        </div>
    );
};

export default AIChat;
