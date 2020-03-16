import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import firebase from "../firebase";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { UserItem } from './UserItem';
import Chip from '@material-ui/core/Chip';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Link } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiAlert from '@material-ui/lab/Alert';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Users() {
  const [name, setName] = React.useState([]);
  const [email, setEmail] = React.useState([]);
  const [password, setPassword] = React.useState([]);
  const [group, setGroup] = React.useState([]);
  const [admin, setAdmin] = React.useState('');
  const [users, setUsers] = React.useState([])
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = React.useState(false);
  const [updName, updateName] = React.useState([]);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const db = firebase.firestore()

    const fetchData = async () => {
      const data = await db.collection("users").get()
      setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }

    db.collection('users').doc(firebase.auth().currentUser.uid).get().then(doc => {
      if (doc.data().admin) {
        fetchData();
        setAdmin("Admin User")
      }
      setName(doc.data().name);
      setEmail(doc.data().email);
      if (doc.data().group != null) {
        setGroup(doc.data().group);
      }
      updateName(doc.data().name);
    })
  }, [])
  const onUpdate = () => {
    const db = firebase.firestore()
    db.collection('users').doc(firebase.auth().currentUser.uid).update({ name: updName })
      .then(() => {
        window.location.reload(false);
      })
  }
  const onResetPassword = () => {
    firebase.auth().currentUser.updatePassword(password).then(function () {
      closeresetPasswordDialog();
      setMessage("Password Reset Successfully");
      showSuccess();
    }).catch(function (error) {
      setMessage(error.message)
      showError();
    });
  }
  const onDeleteUser = () => {
    const curUser = firebase.auth().currentUser;
    const db = firebase.firestore()
    db.collection('users').doc(curUser.uid).delete()
      .then(() => {
        curUser.delete().then(function () {
          window.location.reload(false);
        }).catch(function (error) {
          // An error happened.
        });
      })
  }
  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };
  const openUpdateDialog = () => {
    setUpdateDialogOpen(true);
  };
  const closeresetPasswordDialog = () => {
    setResetPasswordDialogOpen(false);
  };
  const openResetPasswordDialog = () => {
    setResetPasswordDialogOpen(true);
  };
  const showError = () => {
    setErrorOpen(true);
  };

  const hideError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };
  const showSuccess = () => {
    setSuccessOpen(true);
  };
  const hideSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessOpen(false);
  };

  return (
    <div>
      <Grid container spacing={0}>
        <Grid className="userListBox" item xs={7}>
          {users.length > 0 ? (
            <div>
              {users.map(user => (
                <div key={user.id}>
                  <UserItem user={user} />
                </div>
              ))}
            </div>
          ) : (
              <Typography className="deleteUser mediumMargin" variant="h6" component="h6" >You don't have access to the users</Typography>
            )}
        </Grid>
        <Grid item xs={5} className="addUserBox" >
          <div className="righttBox" style={{ position: "fixed" }}>
            <Typography className="textBlack" variant="h4" component="h4" >My Profile</Typography>
            <Typography className="textBlack mediumMargin smallMarginTop" variant="h6" component="h6" >Name : {name}</Typography>
            <Typography className="textBlack mediumMargin" variant="h6" component="h6" >Email : {email}</Typography>
            <Typography className="textBlack mediumMargin" variant="h6" component="h6" >{admin}</Typography>
            {group.length > 0 ? (
              <div >
                {group.map(gr => (
                  <Chip className="groupChip" style={{
                    display: 'flex',
                    flexWrap: 'wrap', marginTop: "5px"
                  }} key={gr} label={gr} />
                ))}
              </div>
            ) : (
                <Typography className="deleteUser mediumMargin" variant="h6" component="h6" >You don't belong to a group yet</Typography>
              )}
            <Box className="smallMarginTop">
              <Link className="resetPassword" onClick={openResetPasswordDialog} >Reset password</Link>
              <Link className="resetPassword" onClick={openUpdateDialog} >Edit</Link>
              <Link onClick={onDeleteUser} className="deleteUser" >Delete Account</Link>
            </Box>
          </div>
        </Grid>
      </Grid>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={hideError}>
        <Alert onClose={hideError} severity="error"> {message}</Alert>
      </Snackbar>
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={hideSuccess}>
        <Alert onClose={hideSuccess} severity="success">{message}</Alert>
      </Snackbar>
      <Dialog open={updateDialogOpen} TransitionComponent={Transition} keepMounted onClose={closeUpdateDialog}>
        <DialogTitle >{"Update Profile details"}</DialogTitle>
        <DialogContent>
          <form className="addForm" noValidate autoComplete="off">
            <TextField label="Name" defaultValue={name} fullWidth onChange={(e) => updateName(e.target.value)}>
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateDialog} color="secondary">Cancel</Button>
          <Button color="primary" onClick={onUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={resetPasswordDialogOpen} TransitionComponent={Transition} keepMounted onClose={closeUpdateDialog}>
        <DialogTitle >{"Reset Password"}</DialogTitle>
        <DialogContent>
          <form className="addForm" noValidate autoComplete="off">
            <TextField type="password" label="New Password" defaultValue={password} fullWidth onChange={(e) => setPassword(e.target.value)}>
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeresetPasswordDialog} color="secondary">Cancel</Button>
          <Button color="primary" onClick={onResetPassword}>Reset Password</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}