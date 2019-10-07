import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';



const useStyles = makeStyles(theme => ({
    loginPanel: {
        width: 500,
        height: 275,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 20
    },
    textField: {
        marginTop:20,
        marginBottom:20,
        width:400
    }
    
}))
export default (props) => {
    const classes = useStyles();

    return (
        <Paper className={classes.loginPanel}>
            <div style={{paddingTop:20}}>
                <TextField
                    label={props.lang.login}
                    className={classes.textField}
                    // InputLabelProps={{
                    //     shrink: true,
                    // }}
                    margin="none"
                    variant="outlined"
                >   
                </TextField>
                <TextField
                    label={props.lang.password}
                    className={classes.textField}
                    // InputLabelProps={{
                    //     shrink: true,
                    // }}
                    margin="none"
                    variant="outlined"
                >   
                </TextField>

            </div>
            <div style={{textAlign:'right', width:'90%'}}>
                <Button color="primary" >
                    LOGIN
                </Button>
                <Button color="primary">
                    {props.lang.cancel}
                </Button>

            </div>
        </Paper>
    )
}