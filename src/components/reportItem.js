// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

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

//To animate transition of dialogs to appear from down to Up
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
    //Getting all groups assigned to current user
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

    //This function is to handle updating a report
    const onUpdateReport = () => {
        const db = firebase.firestore()
        db.collection('reports').doc(report.id).update({ title: updTitle, content: updContent, tag: tag, group: group })
            .then(() => {
                window.location.reload(false);
            })
    }
    //Triggers opening of dialog for updating report
    const onUpdate = () => {
        const db = firebase.firestore()
        updateTitle(title);
        updateContent(reportContent);
        //Open dialog
        openUpdateDialog()
    }
    //This function is to delete a report
    const onDelete = () => {
        const db = firebase.firestore()
        db.collection('reports').doc(report.id).delete()
            .then(() => {
                window.location.reload(false);
            })
    }
    //This function is to upload images to a report.
    const onUpload = (e) => {
        //CHeck if user didnt upalod image
        if (imageRef === '') {
            console.log(`empty`)
        } else {
            // Upload image to firebase storage 
            const uploadTask = storage.ref(`images/${imageRef.name}`).put(imageRef)
            uploadTask.on('state_changed',
                (snapShot) => {
                    console.log(snapShot)
                }, (err) => {
                    console.log(err)
                }, () => {
                    //get download url
                    storage.ref('images').child(imageRef.name).getDownloadURL()
                        .then(fireBaseUrl => {
                            //save download url of image to that report
                            var all = []
                            const db = firebase.firestore()
                            const doc = db.collection('reports').doc(report.id).get().then((item) => {
                                //get current images in the report
                                all = item.data().images
                                //add the new image
                                all.push(fireBaseUrl)
                                setAllImages(all);
                                console.log(allImages)
                                console.log(all)
                            }).then(() => {
                                //Update report with all images
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
    //handle update report dialog
    const openUpdateDialog = () => {
        setUpdateDialogOpen(true);
    };
    const closeUpdateDialog = () => {
        setUpdateDialogOpen(false);
    };
    //handle selection of filter group
    const handleSelectGroup = (e) => {
        setGroup(e.target.value)
    }
    //handle selection of filter tag
    const handleSelectTag = (e) => {
        setTag(e.target.value)
    }
    const closeUploadDialog = () => {
        setUploadDialogOpen(false);
    };
    //handle upload report dialog
    const openUploadDialog = () => {
        setUploadDialogOpen(true);
    };

    return (
        <Box className="reportListItem">
            <Typography className="textBlack" variant="subtitle1">{title}</Typography>
            <Typography className="contentText" paragraph="true" variant="subtitle1">{reportContent}</Typography>
            {/* list images in the report  */}
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
                {/* report action buttons here  */}
                <Box style={{ textAlign: "end" }}>
                    {/* Upload image button  */}
                    <IconButton style={{ display: "inline" }} onClick={openUploadDialog} aria-label="upload" >
                        <PublishIcon fontSize="small" />
                    </IconButton>
                    {/* Delete button  */}
                    <IconButton style={{ display: "inline" }} onClick={onDelete} aria-label="delete" >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    {/* update button  */}
                    <IconButton style={{ display: "inline" }} onClick={onUpdate} aria-label="update" >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <Typography className="creatorEmail" variant="subtitle1">Created by : {creator}</Typography>
                </Box>
            </Box>
            {/* Update report dialog  */}
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
            {/* Upload image Dialog */}
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
