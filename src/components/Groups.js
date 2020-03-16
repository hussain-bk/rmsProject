import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { GrouptItem } from './GroupItem';
import firebase from "../firebase";
import { Typography } from '@material-ui/core';

export default function Groups() {
  const [group, setGroup] = React.useState('');
  const [groups, setGroups] = React.useState([])
  const [admin, setAdmin] = React.useState('');
  const onCreateGroup = () => {
    const db = firebase.firestore()
    db.collection('groups').add({ name: group, id: Math.random() })
      .then(() => {
        window.location.reload(false);
      })
  }
  React.useEffect(() => {
    const db = firebase.firestore()
    const fetchData = async () => {
      const data = await db.collection("groups").get()
      setGroups(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }
    db.collection('users').doc(firebase.auth().currentUser.uid).get().then(doc => {
      if (doc.data().admin) {
        fetchData();
        setAdmin(true)
      } else {
        setAdmin(false)
      }
    })
  }, [])
  return (
    <div>
      {admin ? (
        <div>
          <form className="addForm mediumMargin" noValidate autoComplete="off">
            <TextField placeholder="Add new group" onChange={(e) => setGroup(e.target.value)} />
            <Button className="addGroup" variant="contained" color="primary" size="small" onClick={onCreateGroup}>Add</Button>
          </form>
          {groups.length > 0 ? (
            <div>
              {groups.map(group => (
                <div key={group.id}>
                  <GrouptItem group={group} />
                </div>
              ))}
            </div>
          ) : (
              <Typography className="deleteUser mediumMargin" variant="h6" component="h6" >No groups added yet</Typography>
            )}
        </div>
      ) : (
          <Typography className="deleteUser mediumMargin" variant="h6" component="h6" >You don't have access to Groups</Typography>
        )}
    </div>
  );
}