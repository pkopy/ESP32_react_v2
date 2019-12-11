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
import reds from '../img/search.gif'
import Alert from '../Alert/Alert'

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
        padding: 0,
        
    },
    scale: {
        lineHeight: '25px'
    }

}))

export default (props) => {
    const [scales, setScales] = React.useState([])
    const [foundScales, setFoundScales] = React.useState([])
    const [updatedScales, setUpdatedScales] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const [loader, setLoader] = React.useState(false)
    const [checked, setChecked] = React.useState([]);
    const [alert, setAlert] = React.useState(false)
    const [searchWindowOpen, setSearchWindowOpen] = React.useState(true)
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        props.setOpenSearch(false)
        
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

    const searchScales = () => {
        setSearchWindowOpen(true)
        setAlert(false)
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
                setSearchWindowOpen(false)
                setLoader(false)
                // props.setOpenSearch(false)
                
            } else if (response.respond === "SCALE_NOT_FOUND"){
                setLoader(false)
                setSearchWindowOpen(false)
                // props.setOpenSearch(false)
                setAlert(true)

            }


        }
    }

    const addScales = () => {
        props.socket.send(JSON.stringify({ command: 'ADD_SCALES', scales: checked }))
        getScales()
        // props.drawerView('scales')
        setOpen(false)
        props.setOpenSearch(false)
    }

    const getScales = () => {
        fetch(`http://${props.host}:5000/scale`)
            .then(data => data.json())
            .then(data => {
                setScales(data);
                console.log(data)
            })
            .catch((err) => {

            })
    }

    React.useEffect(() => {
        searchScales()
    },[])

    return (
        <div>
            <Alert
                open={alert}
                func={searchScales}
                close={props.setOpenSearch}
                lang={props.lang}
                context={'Nie znaleziono wag'}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Znaleziono:"}</DialogTitle>
                <DialogContent>


                <List dense className={classes.listOfscales}>
                    <ListSubheader className={classes.scale}>{`Nowe wagi`}</ListSubheader>
                    {foundScales.map((value, i) => {

                        // const labelId = `checkbox-list-secondary-label-${value}`;
                        return (
                            <ListItem key={i} button >
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
                    <ListSubheader className={classes.scale}>{`Zaktualizowane wagi`}</ListSubheader>
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
                        {props.lang.cancel}
                    </Button>
                    <Button onClick={addScales} color="primary" autoFocus disabled={checked.length === 0}>
                        {props.lang.add}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={searchWindowOpen}
            >
            {/* <DialogTitle id="alert-dialog-title">{"Wyszukiwanie wag"}</DialogTitle> */}
            <DialogContent style={{textAlign:'center'}}>
                
                    {loader&&<img src={reds} width={80}style={{position:'relative', top:-3}}></img>}

                
            </DialogContent>
            </Dialog>

        </div>
    )
}