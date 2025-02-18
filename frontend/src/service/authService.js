// src/services/authService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    console.log('Registration successful:', response.data);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

export const fetchAllUsers = async () => {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
};
