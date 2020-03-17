// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

import React from "react";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import firebase from "../firebase";
import { ReportItem } from "./reportItem"
import { storage } from '../firebase';

export default function MainContainer() {
  const [tag, setTag] = React.useState('');
  const [group, setGroup] = React.useState('');
  const [newReportTitle, setNewReport] = React.useState([])
  const [newReportContent, setNewReportContent] = React.useState([])
  const [reports, setReports] = React.useState([])
  const [filterText, setSearchReport] = React.useState('')
  const [filteredTag, setFilteredTag] = React.useState('');
  const [filteredGroup, setFilteredGroup] = React.useState('');
  const [allGroups, setAllGroups] = React.useState([])
  const [userGroups, setUserGroups] = React.useState([])
  const [admin, setAdmin] = React.useState();
  const [allTags, setAllTags] = React.useState([])
  const [imageRef, setImageRef] = React.useState('')

  //This function is to handle creating a report
  const onCreateReport = () => {
    const db = firebase.firestore()
    //create a report in database with all details
    const doc = db.collection('reports').doc();
    doc.set({
      title: newReportTitle, content: newReportContent,
      tag: tag, group: group, creator: firebase.auth().currentUser.email, images: [], id: Math.random()
    })
      .then(() => {
        //If a report has image, we store it in firebase storage,
        // then save download url to the save report record in database

        //First we check if user didnt add image
        if (imageRef === '') {
          window.location.reload(false);
        } else {
          //store image in firebase storage
          const uploadTask = storage.ref(`images/${imageRef.name}`).put(imageRef)
          uploadTask.on('state_changed',
            (snapShot) => {
              console.log(snapShot)
            }, (err) => {
              console.log(err)
            }, () => {
              //Get download url of the image
              storage.ref('images').child(imageRef.name).getDownloadURL()
                .then(fireBaseUrl => {
                  //save url in report record in database
                  doc.update({ "images": [fireBaseUrl] }).then(() => {
                    window.location.reload(false);
                  })
                })
            })
        }
      })
  }
  //Getting all groups in databse
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
          getReportList();
        }
        //save admin flaq
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
  //Fetch reports from database
  const getReportList = () => {
    const db = firebase.firestore()
    db.collection("users").doc(firebase.auth().currentUser.uid).get().then(cred => {
      db.collection("reports").where('group', 'in', cred.data().group).get().then(function (querySnapshot) {
        const all = [];
        querySnapshot.forEach(function (doc) {
          all.push({
            title: doc.data().title,
            content: doc.data().content,
            group: doc.data().group,
            tag: doc.data().tag,
            id: doc.id,
            images: doc.data().images,
            creator: doc.data().creator
          })
        });
        setReports(all);
      })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    })
  };
  //Filter rendered reports base on user selection in UI or search
  const filteredReports = reports.filter(report => {
    return report.tag.toLowerCase().includes(filteredTag.toLowerCase())
      && report.group.toLowerCase().includes(filteredGroup.toLowerCase())
      && (report.title.toLowerCase().includes(filterText.toLowerCase())
        || report.content.toLowerCase().includes(filterText.toLowerCase())
        || report.creator.toLowerCase().includes(filterText.toLowerCase()))
  });
  //Getting image object from UI
  const handleImageAsFile = (e) => {
    const image = e.target.files[0]
    setImageRef(image)
  }
  return (
    <div className="root">
      <Grid container spacing={0}>
        <Grid item xs={7}>
          {/* Main section, search and filter components and report list  */}
          <Box className="righttBox">
            <Typography className="textBlack" variant="h4" component="h4"> Reports </Typography>
            {/* Search component  */}
            <TextField style={{ margin: 8 }} placeholder="Search reports" helperText="Serach by title, content or creator"
              fullWidth margin="normal" InputLabelProps={{ shrink: true }} onChange={(e) => setSearchReport(e.target.value)} />
            {/* Filter components by Tag or Groups */}
            <Box className="filteresBox">
              <Box >
                {/* //Filter by tag */}
                <InputLabel className="smallMarginTop" id="tagFilter">Filter by Tags</InputLabel>
                <Select displayEmpty abelId="tagFilter" fullWidth value={filteredTag} onChange={(e) => setFilteredTag(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {allTags.map(item => (
                    <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                {/* Filter by Group, based on user. */}
                {admin ? (
                  <div>
                    {/* In case of Admin user , this will list all groups */}
                    <InputLabel className="smallMarginTop" id="groupFilterAdmin">Filter by Groups</InputLabel>
                    <Select displayEmpty labelId="groupFilterAdmin" fullWidth value={filteredGroup} onChange={(e) => setFilteredGroup(e.target.value)}>
                      <MenuItem value="">All</MenuItem>
                      {allGroups.map(item => (
                        <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </div>
                ) : (
                    <div>
                      {/* This will list all groups that are assigned to current user only */}
                      <InputLabel className="smallMarginTop" id="groupFilter">Filter by Groups</InputLabel>
                      <Select displayEmpty labelId="groupFilter" fullWidth value={filteredGroup} onChange={(e) => setFilteredGroup(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {userGroups.map(item => (
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}
              </Box>
            </Box>
            {/* List all reports in UI  */}
            <div>
              {filteredReports.map(report => (
                <div key={report.id} onClick="">
                  <ReportItem report={report} />
                </div>
              ))}
            </div>
          </Box>
        </Grid>
        {/* //Add new report section  */}
        <Grid item xs={5} style={{ position: "fixed", right: 0 }}>
          <Box className="righttBox">
            <Typography className="textBlack" variant="h4" component="h4"> Add Report </Typography>
            {/* Add report form  */}
            <form className="addForm" noValidate autoComplete="off">
              <TextField label="Title" onChange={(e) => setNewReport(e.target.value)} fullWidth />
              <TextField label="Content" fullWidth multiline rows="6" variant="outlined" margin="normal" onChange={(e) => setNewReportContent(e.target.value)} />
              {/* Upload image component  */}
              <Box> <input type="file" onChange={handleImageAsFile} /></Box>
              <InputLabel className="smallMarginTop" id="tagSelectadmin" >Tag</InputLabel>
              <Select labelId="tagSelectadmin" fullWidth value={tag} onChange={(e) => setTag(e.target.value)}>
                {allTags.map(item => (
                  <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                ))}
              </Select>
              {/* Group component also based on user assigned groups, or all to aDmin user  */}
              {admin ? (
                <div>
                  <InputLabel className="smallMarginTop" id="groupSelectadmin" >Group</InputLabel>
                  <Select labelId="groupSelectadmin" fullWidth value={group} onChange={(e) => setGroup(e.target.value)}>
                    {allGroups.map(item => (
                      <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </div>
              ) : (
                  <div>
                    <InputLabel className="smallMarginTop" id="groupSelect" >Group</InputLabel>
                    <Select labelId="groupSelect" id="group" fullWidth value={group} onChange={(e) => setGroup(e.target.value)}>
                      {userGroups.map(item => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </div>
                )}
              <Button className="addBtn" fullWidth variant="contained" color="primary" size="large" onClick={onCreateReport}>Add</Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
