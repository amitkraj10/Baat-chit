import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setOtherUsers } from '../redux/userSlice'

const useGetOtherUsers = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/all`)
                dispatch(setOtherUsers(response?.data?.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchOtherUsers()
    }, [])
}

export default useGetOtherUsers