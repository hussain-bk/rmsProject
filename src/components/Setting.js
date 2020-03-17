// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
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