// src/context/ToastContext.js
import { createContext, useContext, useState } from 'react';
import './toast.css'; // Import the toast CSS

const ToastContext = createContext();

export const useToast = () => {
    return useContext(ToastContext);
};

const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const showToast = (message, type = 'info') => {
        setToast({ message, type, visible: true });

        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000); // Auto-hide after 3 seconds
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    );
};

export default ToastProvider;
