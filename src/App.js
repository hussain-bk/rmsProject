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
          <Switch>
            <PrivateRoute exact path="/" component={Content} />
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
