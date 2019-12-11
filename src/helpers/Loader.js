import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import search from '../img/search.gif'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles(theme => ({
    progress: {
        margin: theme.spacing(2),
    },
}));

export default function CircularIndeterminate() {
    const classes = useStyles();

    return (

        <Dialog
            open={true}
        >
            {/* <DialogTitle id="alert-dialog-title">{"Wyszukiwanie wag"}</DialogTitle> */}
            <DialogContent style={{ textAlign: 'center' }}>

                <img src={search} width={80} style={{ position:'relative', top:-3 }}></img>


            </DialogContent>
        </Dialog>
        // <div>
        //     <div style={{zIndex:100, position:'fixed',width:'100%', height:'100vh', backgroundColor:'gray', opacity:.5, left:0, top:0}}>

        //     </div>
        //   <CircularProgress className={classes.progress} style={{left: '50%',top: '50%', color:'#fff', zIndex:101,position: 'absolute', marginLeft:'auto', marginRigh:'auto'}}/>

        // </div>
    );
}