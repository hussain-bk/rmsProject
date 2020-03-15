import React from 'react';
import firebase from "../firebase";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export const GrouptItem = ({group}) => {
    const [name] = React.useState(group.name);

    const onDelete = () => {
        const db = firebase.firestore()
        db.collection('groups').doc(group.id).delete()

        .then(() =>{
            window.location.reload(false);
        })
    }
    return(
        <div className="groupItem">
            <Typography className="tinyMarginTop" variant="subtitle1">{name}</Typography>
            <IconButton style={{display: "inline"}} onClick={onDelete} aria-label="delete" >
                <DeleteIcon className="deleteIcon" fontSize="small" />
            </IconButton>
        </div>
    );
}
