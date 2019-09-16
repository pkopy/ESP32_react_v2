import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        position: 'relative',
        width: 200,
        height:200,
        border: '1px solid rgb(109,109,109,0.25)',
        backgroundColor: '#fff',
    },
    textField: {
        position: 'absolute',
        top: '-47px',
        color: 'rgb(109,109,109, 0.9)',
        // color: '#000',
        
        fontSize: 'small',
        backgroundColor: '#fff',
        
    },
    dense: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: 19,
        width: 200
    },
    title: {
        position: 'absolute',
        padding: '0 3px',
        color: 'rgb(109,109,109, 0.9)',
        margin: 0,
        top: '-11px',
        left: '5px',
        backgroundColor: '#fff'
    },
    
}));

export default (props) => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
                <p className={classes.title}>{props.title}</p>
        </div>
    )
}