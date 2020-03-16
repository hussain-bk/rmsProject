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
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import PublishIcon from '@material-ui/icons/Publish';
import { storage } from '../firebase';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const ReportItem = ({ report }) => {
    const [title] = React.useState(report.title);
    const [reportContent] = React.useState(report.content);
    const [tag, setTag] = React.useState(report.tag);
    const [group, setGroup] = React.useState(report.group);
    const [images] = React.useState(report.images);
    const [creator] = React.useState(report.creator);
    const [updTitle, updateTitle] = React.useState([]);
    const [updContent, updateContent] = React.useState([]);
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
    const [allGroups, setAllGroups] = React.useState([])
    const [allTags, setAllTags] = React.useState([])
    const [userGroups, setUserGroups] = React.useState([])
    const [admin, setAdmin] = React.useState();
    const [imageRef, setImageRef] = React.useState('')
    const [allImages, setAllImages] = React.useState([])

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
        updateTitle(title);
        updateContent(reportContent);
        openUpdateDialog()
    }
    const onDelete = () => {
        const db = firebase.firestore()
        db.collection('reports').doc(report.id).delete()
            .then(() => {
                window.location.reload(false);
            })
    }
    const onUpload = (e) => {
        if (imageRef === '') {
            console.log(`empty`)
        } else {
            const uploadTask = storage.ref(`images/${imageRef.name}`).put(imageRef)
            uploadTask.on('state_changed',
                (snapShot) => {
                    console.log(snapShot)
                }, (err) => {
                    console.log(err)
                }, () => {
                    storage.ref('images').child(imageRef.name).getDownloadURL()
                        .then(fireBaseUrl => {
                            //save to that document
                            var all = []
                            const db = firebase.firestore()
                            const doc = db.collection('reports').doc(report.id).get().then((item) => {
                                all = item.data().images
                                all.push(fireBaseUrl)
                                setAllImages(all);
                                console.log(allImages)
                                console.log(all)
                            }).then(() => {
                                db.collection('reports').doc(report.id).update({ images: all }).then(() => {
                                    window.location.reload(false);
                                })
                            })
                        })
                })
        }
    }
    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        setImageRef(image)
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
    const closeUploadDialog = () => {
        setUploadDialogOpen(false);
    };
    const openUploadDialog = () => {
        setUploadDialogOpen(true);
    };

    return (
        <Box className="reportListItem">
            <Typography className="textBlack" variant="subtitle1">{title}</Typography>
            <Typography className="contentText" paragraph="true" variant="subtitle1">{reportContent}</Typography>
            <Box className="imageBox" >
                <div>
                    {images.map(item => (
                        <img className="reportImage" height="100" width="100" src={item} />
                    ))}
                </div>
            </Box>
            <Box className="card-actionBox">
                <Box>
                    <Chip className="chip" className="tagChip" label={tag} />
                    <Chip className="chip" label={group} />
                </Box>
                <Box style={{ textAlign: "end" }}>
                    <IconButton style={{ display: "inline" }} onClick={openUploadDialog} aria-label="upload" >
                        <PublishIcon fontSize="small" />
                    </IconButton>
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
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeUpdateDialog} color="secondary">Cancel</Button>
                    <Button onClick={onUpdateReport} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
            {/* // Upload image Dialog */}
            <Dialog open={uploadDialogOpen} TransitionComponent={Transition} keepMounted onClose={closeUploadDialog}>
                <DialogTitle >{"Upload image"}</DialogTitle>
                <DialogContent>
                    <form className="addForm" noValidate autoComplete="off">
                        <Box>
                            <input type="file" onChange={handleImageAsFile} />
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeUploadDialog} color="secondary">Cancel</Button>
                    <Button color="primary" onClick={onUpload}>Upload</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
