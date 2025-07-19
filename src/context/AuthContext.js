import React, { createContext, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        const response = await axiosInstance.post('/auth/login/', {
            email,
            password
        });
        if (response.status === 200) {
            setAuthTokens(response.data);
            // レスポンスから完全なユーザーオブジェクトを設定
            setUser(response.data.user); 
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            // ユーザーオブジェクトもローカルストレージに保存
            localStorage.setItem('user', JSON.stringify(response.data.user)); 
            navigate('/');
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;