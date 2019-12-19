import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { findProps } from 'devextreme-react/core/template';


const useStyles = makeStyles(theme => ({
    
    button: {
        margin: '0 15px 15px 0'
    }

}))
export default function AlertDialog(props) {
    const [open, setOpen] = React.useState(true);
    const classes = useStyles();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>

            <Dialog
                open={props.open}
                // onClose={handleClose}
                fullWidth={true}
                maxWidth={'md'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.title || 'Alert'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.context}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.button} onClick={() => {props.close(); handleClose()}} variant="contained" color="primary" >
                        {props.lang.cancel || 'CANCEL'}
                    </Button>
                    <Button className={classes.button} onClick={() => {props.func(); handleClose()}} variant="contained" color="primary" >
                        {props.lang.search || 'SEARCH'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
