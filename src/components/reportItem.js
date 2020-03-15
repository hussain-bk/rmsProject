import React from "react"
import firebase from "../firebase"
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Box } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const ReportItem = ({ report }) => {
    const [title] = React.useState(report.title);
    const [reportContent] = React.useState(report.content);
    const [tag,setTag] = React.useState(report.tag);
    const [group, setGroup] = React.useState(report.group);
    const [creator] = React.useState(report.creator);
    const [updTitle, updateTitle] = React.useState([]);
    const [updContent, updateContent] = React.useState([]);
    const [updTag, updateTag] = React.useState('');
    const [updGroup, updateGroup] = React.useState('');
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
    const [allGroups, setAllGroups] = React.useState([])
    const [allTags, setAllTags] = React.useState([])
    const [userGroups, setUserGroups] = React.useState([])
    const [admin, setAdmin] = React.useState();


    //Getting all groups
    React.useEffect(() => {
        const db = firebase.firestore()
        const fetchData = async () => {
            const data = await db.collection("groups").get()
            setAllGroups(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        }
        fetchData();
    }, [])
    //Getting Current User Groups
    React.useEffect(() => {
        const db = firebase.firestore()
        const fetchData = async () => {
            db.collection("users").doc(firebase.auth().currentUser.uid).get().then(doc => {
                if (doc.data().group != null) {
                    setUserGroups(doc.data().group)
                }
                setAdmin(doc.data().admin)
            })
        }
        fetchData();
    }, [])
    //Getting all Tags
    React.useEffect(() => {
        const db = firebase.firestore()
        const fetchData = async () => {
            const data = await db.collection("classifications").get()
            setAllTags(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        }
        fetchData();
    }, [])

    const onUpdateReport = () => {
        const db = firebase.firestore()
        db.collection('reports').doc(report.id).update({ title: updTitle, content: updContent, tag: tag, group: group })
            .then(() => {
                window.location.reload(false);
            })
    }

    const onUpdate = () => {

        const db = firebase.firestore()
        const id = db.collection('reports').doc(report.id)

        updateTitle(title);
        updateContent(reportContent);
        updateTag(tag);
        updateGroup(group);

        openUpdateDialog()

    }
    const onDelete = () => {
        const db = firebase.firestore()
        db.collection('reports').doc(report.id).delete()

            .then(() => {
                window.location.reload(false);
            })
    }

    const openUpdateDialog = () => {
        setUpdateDialogOpen(true);
    };

    const closeUpdateDialog = () => {
        setUpdateDialogOpen(false);
    };
    const handleSelectGroup = (e) => {
        setGroup(e.target.value)
    
    }
    const handleSelectTag = (e) => {
        setTag(e.target.value)
        
    }

    return (

        <div className="reportListItem">

            <Typography className="textBlack" variant="subtitle1">{title}</Typography>

            <Typography className="contentText" paragraph="true" variant="subtitle1">{reportContent}</Typography>
            <Box className="card-actionBox">
                <Box>
                    <Chip className="chip" className="tagChip" label={tag} />
                    <Chip className="chip" label={group} />
                </Box>
                <Box style={{ textAlign: "end" }}>
                    <IconButton style={{ display: "inline" }} onClick={onDelete} aria-label="delete" >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton style={{ display: "inline" }} onClick={onUpdate} aria-label="update" >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <Typography className="creatorEmail" variant="subtitle1">Created by : {creator}</Typography>
                </Box>

            </Box>

            <Dialog open={updateDialogOpen} TransitionComponent={Transition} keepMounted onClose={closeUpdateDialog}>
                <DialogTitle >{"Update report"}</DialogTitle>
                <DialogContent>
                    <form className="addForm" noValidate autoComplete="off">
                        <TextField label="Title" defaultValue={title} fullWidth onChange={(e) => updateTitle(e.target.value)}></TextField>
                        <TextField label="Content" defaultValue={reportContent} fullWidth multiline rows="6" variant="outlined" margin="normal" onChange={(e) => updateContent(e.target.value)} />
                        
                            <InputLabel className="smallMarginTop" id="tagSelectadmin" >Tag</InputLabel>
                            <Select labelId="tagSelectadmin" fullWidth value={tag} onClick={(e) => handleSelectTag(e)}>
                                {allTags.map(item => (
                                    <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                                ))}
                            </Select>

                            {admin ? (
                                <div>
                                    <InputLabel className="smallMarginTop" id="groupSelectadmin" >Group</InputLabel>
                                    <Select labelId="groupSelectadmin" fullWidth value={group} onClick={(e) => handleSelectGroup(e)}>
                                        {allGroups.map(item => (
                                            <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                                        ))}
                                    </Select>
                                </div>

                            ) : (
                                    <div>
                                        <InputLabel className="smallMarginTop" id="groupSelect" >Group</InputLabel>
                                        <Select labelId="groupSelect" id="group" fullWidth value={group} onChange={(e) => handleSelectGroup(e)}>
                                            {userGroups.map(item => (
                                                <MenuItem key={item} value={item}>{item}</MenuItem>
                                            ))}
                                        </Select>
                                    </div>

                                )}

                            {/* <InputLabel className="smallMarginTop" id="groupSelect" >Group</InputLabel>
                        <Select labelId="groupSelect" fullWidth defaultValue={group} onChange={(e) => updateGroup(e.target.value)}>

                            <MenuItem value={"Saudi Arabia"}>Saudi Arabia</MenuItem>
                            <MenuItem value={"United States"}>United States</MenuItem>
                            <MenuItem value={"Norway"}>Norway</MenuItem>
                        </Select> */}

                            {/* <Button className="addBtn" fullWidth variant="contained" color="primary" size="large" onClick={onUpdateReport}>Add</Button> */}
                    </form>
                </DialogContent>
                    <DialogActions>
                        <Button onClick={closeUpdateDialog} color="secondary">Cancel</Button>
                        <Button onClick={onUpdateReport} color="primary">Update</Button>
                    </DialogActions>
            </Dialog>

        </div>
            );
        }
