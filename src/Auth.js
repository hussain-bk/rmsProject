// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

import React, { useEffect, useState } from "react";
import firebase from './firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    //To get current user credentials
    useEffect(() => {
        firebase.auth().onAuthStateChanged(setCurrentUser);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};