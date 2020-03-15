import React from 'react';
import MainContainer from "./MainContainer"
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import firebase from "../firebase";
import DnsIcon from '@material-ui/icons/Dns';
import Link from '@material-ui/core/Link';
import { AuthProvider } from '../Auth';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter as Router, Route, Switch, BrowserRouter } from "react-router-dom";
import {withRouter,Redirect} from "react-router";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Users from './Users';
import Groups from './Groups';


export default function Setting() {
    
    const [value, setValue] = React.useState(0);

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography component="div" role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                {...other}>
                {value === index && <Box p={3}>{children}</Box>}
            </Typography>
        );
    }
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
            <Box className="">
                <Typography className="textBlack" variant="h4" component="h4"> Settings </Typography>
                <Tabs className="smallMarginTop" value={value} onChange={handleChange} aria-label="tabs">
                    <Tab label="Users" {...tabProps(0)} />
                    <Tab label="Groups" {...tabProps(1)} />
                </Tabs>

                <TabPanel value={value} index={0}>
                    <Users />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Groups />
                </TabPanel>
            </Box>
        </div>
    );
}