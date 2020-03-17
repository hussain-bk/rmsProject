// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

import React, { useContext } from "react";
import { AuthContext } from '../Auth';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const { currentUser } = useContext(AuthContext)
    return (
        <Route
            {...rest}
            render={routeProps =>
                !!currentUser ? (
                    <RouteComponent {...routeProps} />
                ) : (
                        //Redirect user to login screen if authorization to session denied or closed
                        <Redirect to={"/login"} />
                    )}
        />
    );
};
export default PrivateRoute