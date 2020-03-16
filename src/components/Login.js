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

const Login = ({ history }) => {
    const [errorOpen, setErrorOpen] = React.useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {
                await firebase
                    .auth()
                    .signInWithEmailAndPassword(email.value, password.value);
                history.push("/");
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
                    <Box className="login-leftBox">
                        <Typography className="login-LogoText"> RMS </Typography>
                        <Typography className="login-LogoSubText"> Report Management system </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box className="login-rightBox">
                        <Typography className="login-title"> Login to your account to continue </Typography>
                        <form onSubmit={handleLogin} className="loginForm" noValidate autoComplete="off">
                            <TextField required fullWidth id="email" margin="normal" label="Email" variant="outlined" />
                            <TextField required fullWidth type="password" id="password" margin="normal" label="Password" variant="outlined" />
                            <Button type="submit" fullWidth className="login-btn" variant="contained">LOG IN</Button>
                        </form>
                        <Link className="SignLink" href="/signup" >Are you new ? Sign Up</Link>
                        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={hideError}>
                            <Alert onClose={hideError} severity="error"> Username or password incorrect</Alert>
                        </Snackbar>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};
export default withRouter(Login);