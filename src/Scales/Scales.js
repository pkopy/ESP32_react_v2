import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';
import Scale from './Scale'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loader from '../helpers/Loader'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import ListSubheader from '@material-ui/core/ListSubheader';



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
        borderBottom: '1px solid rgb(0,0,0,0.25)',
        textAlign: 'center',
        transition: '0.5s',
        "&:hover": {
            backgroundColor: '#fff'
        }
    },
    title: {
        paddingBottom: '30px',
        fontFamily: 'Roboto'
    },
    listOfscales: {

    }
}))


export default function Scales(props) {
    const [scales, setScales] = React.useState([])
    const [foundScales, setFoundScales] = React.useState([])
    const [updatedScales, setUpdatedScales] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const [loader, setLoader] = React.useState(false)
    const [checked, setChecked] = React.useState([]);
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleToggle = value => () => {
        const newChecked = [...checked];
        const helpArr = []
        for (let elem of newChecked) {
            helpArr.push(elem.address)
        }
        const currentIndex = helpArr.indexOf(value.address);
        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        console.log(newChecked)
    };
    React.useEffect(() => {
        getScales()
    }, [])


    React.useEffect(() => {
        
        const timer = setInterval(getScales, 5000) 
        return () => {
            clearInterval(timer);
        };
    }, [])

    const getScales = () => {
        fetch(`http://${props.host}:5000/scale`)
            .then(data => data.json())
            .then(data => {
                setScales(data);
                // console.log(data)
            })
            .catch((err) => {

            })
    }

    const searchScales = () => {
        props.socket.send(JSON.stringify({ command: 'SEARCH_SCALES' }))
        setLoader(true)
        setChecked([])
        props.socket.onmessage = (e) => {
            let data = e.data;
            const response = JSON.parse(data);
            console.log(response)
            if (response.scales && response.scales.length > 0) {

                handleClickOpen(true)
                setFoundScales(response.scales)
                setLoader(false)
                
            } else if (response.respond === "SCALE_NOT_FOUND"){
                setLoader(false)
            }
        }
    }

    const addScales = () => {
        props.socket.send(JSON.stringify({ command: 'ADD_SCALES', scales: checked }))
        setOpen(false)
    }
    return (
        <div>
            {loader && <Loader />}
            <Typography variant="h4" className={classes.title} >
                {props.lang.scales}
            </Typography>
            <div className={classes.container}>
                {scales.map((elem,i) =>
                    elem.status !== 'Hidden' &&
                    <Scale key={i}
                        setLoader={setLoader}
                        scale={elem}
                        socket={props.socket}
                        lang={props.lang}
                        drawerView={props.drawerView}
                        setCurrentScale={props.setCurrentScale}
                    />
                )}
            </div>
            {scales.length === 0&&<Button variant="outlined" color='primary' onClick={searchScales} disabled={!props.socketStatus}>
                {props.lang.search}
            </Button>}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Znaleziono:"}</DialogTitle>
                <DialogContent>


                    <List dense className={classes.listOfscales}>
                        <ListSubheader>{`Nowe wagi`}</ListSubheader>
                        {foundScales.map((value, i) => {
                            return (
                                <ListItem key={i} button>
                                    <ListItemText id={i} primary={`${props.lang.scale}: ${value.address}`} />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            edge="end"
                                            onChange={handleToggle(value)}
                                            inputProps={{ 'aria-labelledby': i }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                        <ListSubheader>{`Zaktualizowane wagi`}</ListSubheader>
                        {updatedScales.map((value, i) => {

                            return (
                                <ListItem key={i} button>
                                    <ListItemText id={i} primary={`${props.lang.scale}: ${value.address}`} />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            edge="end"
                                            inputProps={{ 'aria-labelledby': i }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {props.lang.cancel}
                    </Button>
                    <Button onClick={addScales} color="primary" autoFocus>
                        {props.lang.add}
                    </Button>
                </DialogActions>
            </Dialog>


        </div>

    )

}