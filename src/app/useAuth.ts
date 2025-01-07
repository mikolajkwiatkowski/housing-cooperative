// hooks/useAuth.ts
"use client";
import { useEffect } from 'react';

const useAuth = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login_panel';
        }
    }, []);
};

export default useAuth;
