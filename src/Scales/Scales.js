import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';
import Scale from './Scale'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loader from '../helpers/Loader'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
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
        // fontSize:50
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

    // React.useEffect(() => {
    //     console.log('ooo')
    // })

    React.useEffect(() => {
        
        const timer = setInterval(getScales, 5000) 
        return () => {
            clearInterval(timer);
        };
    }, [])

    const getScales = () => {
        fetch('http://localhost:5000/scale')
            .then(data => data.json())
            .then(data => {
                setScales(data);
                console.log(data)
                // this.setState({load: false})
            })
            .catch((err) => {
                // this.setState({load: false})
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
                getScales()
                
            } else if (response.respond === "SCALE_NOT_FOUND"){
                setLoader(false)
            }
        }
    }

    const addScales = () => {
        props.socket.send(JSON.stringify({ command: 'ADD_SCALES', scales: checked }))
        getScales()
        // props.drawerView('scales')
        setOpen(false)
    }
    // console.log(props)
    return (
        <div>
            {loader && <Loader />}
            <Typography variant="h4" className={classes.title} >
                {props.lang.scales}
            </Typography>
            <div className={classes.container}>
                {scales.map(elem =>
                    elem.status !== 'Hidden' &&
                    <Scale key={elem.address}
                        scale={elem}
                        socket={props.socket}
                        lang={props.lang}
                        drawerView={props.drawerView}
                        setCurrentScale={props.setCurrentScale}
                    />
                )}
            </div>
            <Button variant="outlined" color='primary' onClick={searchScales} disabled={!props.socketStatus}>
                {props.lang.search}
            </Button>
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

                            // const labelId = `checkbox-list-secondary-label-${value}`;
                            return (
                                <ListItem key={i} button>
                                    {/* <ListItemAvatar>
                                <Avatar
                                    alt={`Avatar n°${value + 1}`}
                                    src={`/static/images/avatar/${value + 1}.jpg`}
                                />
                                </ListItemAvatar> */}
                                    <ListItemText id={i} primary={`${props.lang.scale}: ${value.address}`} />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            edge="end"
                                            onChange={handleToggle(value)}
                                            // checked={checked.indexOf(value) !== -1}
                                            inputProps={{ 'aria-labelledby': i }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                        <ListSubheader>{`Zaktualizowane wagi`}</ListSubheader>
                        {updatedScales.map((value, i) => {

                            // const labelId = `checkbox-list-secondary-label-${value}`;
                            return (
                                <ListItem key={i} button>
                                    {/* <ListItemAvatar>
                            <Avatar
                                alt={`Avatar n°${value + 1}`}
                                src={`/static/images/avatar/${value + 1}.jpg`}
                            />
                            </ListItemAvatar> */}
                                    <ListItemText id={i} primary={`${props.lang.scale}: ${value.address}`} />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            edge="end"
                                            // onChange={handleToggle(value)}
                                            // checked={checked.indexOf(value) !== -1}
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
                        Disagree
                    </Button>
                    <Button onClick={addScales} color="primary" autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>


        </div>

    )

}