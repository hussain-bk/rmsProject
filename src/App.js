// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

import React from 'react';
import Content from "./components/Content"
import { AuthProvider } from './Auth';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import Signup from './components/Signup';

function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          {/* Application routes */}
          <Switch>
            {/* Home screen */}
            <PrivateRoute exact path="/" component={Content} />
            {/* Login screen  */}
            <Route path="/login" component={Login}/>
            {/* sign up screen  */}
            <Route path="/signup" component={Signup}>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
