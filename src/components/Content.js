// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

import React from 'react';
import MainContainer from "./MainContainer"
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import firebase from "../firebase";
import Link from '@material-ui/core/Link';
import Setting from './Setting';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';

export default function Content() {
    const [value, setValue] = React.useState(0);

    //Sidebar tabs
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <Typography component="div" ole="tabpanel" hidden={value !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                {...other}>
                {value === index && <Box p={3}>{children}</Box>}
            </Typography>
        );
    }
    //to handle changing between tabs
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };
    function tabProps(index) {
        return {
            id: `tab-${index}`,
            'aria-controls': `tabpanel-${index}`,
        };
    }
    return (
        <div className="root">
            <Grid container spacing={0}>
                {/* Side bar Section */}
                <Grid item xs={2}>
                    <Box className="leftBox">
                        <Tabs orientation="vertical" value={value} onChange={handleChange} aria-label="tabs">
                            {/* //List of menu tabs  */}
                            <Tab className="tabItem" label="Reports" {...tabProps(0)} />
                            <Tab className="tabItem" label="Setting" {...tabProps(1)} />
                        </Tabs>
                        {/* Signout button */}
                        <Link color="textPrimary" component="button" variant="body2" onClick={() => firebase.auth().signOut()} >LOGOUT</Link>
                    </Box>
                </Grid>
                {/* Main container section  */}
                <Grid item xs={10}>
                    <div >
                        {/* List of containers related to each tab from sidebar, each given a uniqe index number */}
                        <TabPanel value={value} index={0}>
                            <MainContainer />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Setting />
                        </TabPanel>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}
