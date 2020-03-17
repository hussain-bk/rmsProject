// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

import React, { useCallback, useContext } from 'react';
import { withRouter, Redirect } from "react-router";
import firebase from '../firebase';
import { AuthContext } from '../Auth';
import { Typography, Link } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

//This function is to handle sign up to app given name, email and password,
//using firebase authentication function
const Signup = ({ history }) => {
    const [errorOpen, setErrorOpen] = React.useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleSignup = useCallback(
        async event => {
            //To prevent reloading the page when submit the forms
            event.preventDefault();
            //Get name, email and password from form
            const { email, password, name } = event.target.elements;
            const db = firebase.firestore();
            try {
                await firebase
                    .auth()
                    .createUserWithEmailAndPassword(email.value, password.value).then(cred => {
                        //after success sign up to firebase, we create a record in database with name admin flaq and groups
                        //by defult we gave all users a "Public" group
                        return db.collection("users").doc(cred.user.uid).set({
                            name: name.value, email: email.value, admin: false, group: ["Public"]
                        });
                    }).then(() => {
                        //navigate to home screen
                        history.push("/");
                    });
            } catch (error) {
                //Display error message to User
                showError();
            }
        }, [history]
    );
    //checking if user already logged in, we direct to home screen
    if (currentUser) {
        return <Redirect to="/" />
    }
    const showError = () => {
        setErrorOpen(true);
    };
    const hideError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };
    return (
        <div>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <Box className="login-rightBox">
                        <Typography className="login-title"> Sign Up with your email and Password to continue </Typography>
                        {/* sign up form component, name , email and password */}
                        <form onSubmit={handleSignup} className="loginForm" noValidate autoComplete="off">
                            <TextField required fullWidth id="name" margin="normal" label="Name" variant="outlined" />
                            <TextField required fullWidth id="email" margin="normal" label="Email" variant="outlined" />
                            <TextField required fullWidth type="password" id="password" margin="normal" label="Password" variant="outlined" />
                            <Button type="submit" fullWidth className="signup-btn" variant="contained">Sign Up</Button>
                        </form>
                        {/* navigate to Login screen if user dont have credentials  */}
                        <Link className="SignLink" href="/login" >Already have an account ? Login</Link>
                        {/* alert component to show login errors, hidden by defaul  */}
                        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={hideError}>
                            <Alert onClose={hideError} severity="error"> Username or password incorrect</Alert>
                        </Snackbar>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box className="signup-leftBox">
                        <Typography className="login-LogoText"> RMS </Typography>
                        <Typography className="login-LogoSubText"> Report Management system </Typography>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default withRouter(Signup);