import React from 'react';
import firebase from "../firebase";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const GrouptItem = ({ group }) => {
    const [name] = React.useState(group.name);
    const [errorOpen, setErrorOpen] = React.useState(false);

    const onDelete = () => {
        const db = firebase.firestore()
        const doc = db.collection('groups').doc(group.id).get().then(item => {
            const name = item.data().name;
            if (name !== "Public") {
                db.collection('groups').doc(group.id).delete().then(() => {
                    window.location.reload(false);
                })
            } else {
                showError();
            }
        });
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
        <div className="groupItem">
            <Typography className="tinyMarginTop" variant="subtitle1">{name}</Typography>
            <IconButton style={{ display: "inline" }} onClick={onDelete} aria-label="delete" >
                <DeleteIcon className="deleteIcon" fontSize="small" />
            </IconButton>
            <Snackbar open={errorOpen} autoHideDuration={6000} onClose={hideError}>
                <Alert onClose={hideError} severity="error"> "Public" group can not be deleted</Alert>
            </Snackbar>
        </div>
    );
}
