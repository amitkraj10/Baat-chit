import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from '../redux/messageSlice';

const useGetMessages = () => {
    const {selectedUser} = useSelector(store => store.user)
    const dispatch  = useDispatch()
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                axios.defaults.withCredentials = true
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${selectedUser?._id}`)   
                console.log(response?.data?.data)
                dispatch(setMessages(response?.data?.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchMessages()
    }, [selectedUser])
}

export default useGetMessages