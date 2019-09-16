import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Paper from '@material-ui/core/Paper';
import { textAlign } from '@material-ui/system';
import { Center } from 'devextreme-react/map';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';

import Tooltip from '@material-ui/core/Tooltip';
import { HoverStyle } from 'devextreme-react/range-selector';
import 'typeface-roboto';
import Scale from './Scale'




const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '80%',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        
    },

    itemText: {
        // fontSize:50
        borderBottom: '1px solid rgb(0,0,0,0.25)',
        textAlign: 'center',
        transition: '0.5s',
        "&:hover": {
            backgroundColor:'#fff'
        }
    },
    title: {
        paddingBottom: '30px',
        fontFamily:'Roboto'
    }
}))


export default function Scales(props) {
    const classes = useStyles();

    return (
        <div>
            <Typography variant="h4" className={classes.title} >
                Twoje wagi
            </Typography>
            <div className={classes.container}>
                {props.scales.map(elem => 
                    <Scale key={elem.address}
                        scale={elem}
                        drawerView={props.drawerView}
                        setCurrentScale={props.setCurrentScale}
                    />
                )}
            </div>

        </div>

    )

}