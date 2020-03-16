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

const Signup = ({ history }) => {
    const [errorOpen, setErrorOpen] = React.useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleSignup = useCallback(
        async event => {
            event.preventDefault();
            const { email, password, name } = event.target.elements;
            const db = firebase.firestore();
            try {
                await firebase
                    .auth()
                    .createUserWithEmailAndPassword(email.value, password.value).then(cred => {
                        return db.collection("users").doc(cred.user.uid).set({
                            name: name.value, email: email.value, admin: false, group: ["Public"]
                        });
                    }).then(() => {
                        history.push("/");
                    });
            } catch (error) {
                showError();
            }
        }, [history]
    );
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
                        <form onSubmit={handleSignup} className="loginForm" noValidate autoComplete="off">
                            <TextField required fullWidth id="name" margin="normal" label="Name" variant="outlined" />
                            <TextField required fullWidth id="email" margin="normal" label="Email" variant="outlined" />
                            <TextField required fullWidth type="password" id="password" margin="normal" label="Password" variant="outlined" />
                            <Button type="submit" fullWidth className="signup-btn" variant="contained">Sign Up</Button>
                        </form>
                        <Link className="SignLink" href="/login" >Already have an account ? Login</Link>
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