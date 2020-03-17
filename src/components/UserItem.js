// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

import React from "react"
import firebase from "../firebase"
import Typography from '@material-ui/core/Typography';
import { Box, Link } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const UserItem = ({ user }) => {
    const [name] = React.useState(user.name);
    const [email] = React.useState(user.email);
    const [group] = React.useState(user.group);
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
    const [updGroups, updateGroups] = React.useState([])
    const [allGroups, setAllGroups] = React.useState([])
    const [adminText, setAdminText] = React.useState(user.admin);

    React.useEffect(() => {
        const db = firebase.firestore()
        const fetchData = async () => {
            const data = await db.collection("groups").get()
            setAllGroups(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        }
        fetchData();
    }, [])
    const onUpdateUser = () => {
        const db = firebase.firestore()
        db.collection('users').doc(user.id).update({ group: updGroups, admin: adminText })
            .then(() => {
                window.location.reload(false);
            })
    }
    const onUpdate = () => { openUpdateDialog() }
    const closeUpdateDialog = () => { setUpdateDialogOpen(false); };
    const openUpdateDialog = () => { setUpdateDialogOpen(true); };
    const handleChange = event => { updateGroups(event.target.value); };

    return (
        <div className="userItem">
            <Box className="flex space-Between">
                <Typography className="textBlack username" variant="subtitle1">{name}</Typography>
                {adminText ? (
                    <Typography className="adminText" variant="subtitle1">Admin</Typography>
                ) : (
                        <Typography className="adminText" variant="subtitle1"></Typography>
                    )}
            </Box>
            <Typography paragraph="true" className="textBlack" variant="subtitle1">Email : {email}</Typography>
            <Box className="card-actionBox">
                <Box>
                    <div>
                        {group.map(gr => (
                            <Chip className="groupChip" style={{
                                display: 'flex',
                                flexWrap: 'wrap', marginTop: "5px"
                            }} key={gr} label={gr} />
                        ))}
                    </div>
                </Box>
                <Box className="userLinksBox" >
                    <Link className="resetPassword" onClick={onUpdate} >Edit</Link>
                </Box>
            </Box>
            <Dialog open={updateDialogOpen} TransitionComponent={Transition} keepMounted onClose={closeUpdateDialog}>
                <DialogTitle >{"Update User details"}</DialogTitle>
                <DialogContent>
                    <form className="addForm" noValidate autoComplete="off">
                        <Box style={{ display: "block" }}>
                            <FormControl style={{
                                width: '15rem'
                            }}>
                                <Select
                                    labelId="groupFilter"
                                    id="groupSelectot"
                                    multiple
                                    value={updGroups}
                                    onChange={handleChange}
                                    input={<Input />}
                                    renderValue={selected => (
                                        <div >
                                            {selected.map(value => (
                                                <Chip className="groupChip" style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    marginTop: "5px"
                                                }} key={value} label={value} />
                                            ))}
                                        </div>
                                    )}
                                >
                                    {allGroups.map(item => (
                                        <MenuItem key={item.id} value={item.name}>
                                            <Checkbox checked={updGroups.indexOf(item.name) > -1} />
                                            <ListItemText primary={item.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <FormControlLabel control={
                            <Checkbox onChange={(e) => setAdminText(e.target.checked)} checked={adminText} color="primary" />
                        }
                            label="Admin" />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeUpdateDialog} color="secondary">Cancel</Button>
                    <Button onClick={onUpdateUser} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}