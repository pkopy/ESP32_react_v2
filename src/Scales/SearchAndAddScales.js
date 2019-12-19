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
import { Tooltip } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import wtc from '../img/wtc.png'
import c315 from '../img/C315.png'
import hy10 from '../img/scale_hy10.png';
import pue71 from '../img/pue71.png'
import { Center } from 'devextreme-react/map';

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
    },
    img: {
        transition: '0.5s',
        "&:hover": {
            cursor: 'pointer',
            backgroundColor: '#f0f8ff',
            boxShadow: '3px 3px 4px 0px rgba(0, 0, 0, 0.25)'
        }
    },
    test: {
        backgroundColor: '#f0f8ff',
        boxShadow: '3px 3px 4px 0px rgba(0, 0, 0, 0.25)'
    },
    check: {
        position: 'absolute',
        right: 0,
        margin: 10,
        border: '1px solid rgb(0,0,0,0.25)',
        width: 24,
        height: 24,
        // "&:hover": {
        //     cursor: 'pointer',

        // }
    },
    button: {
        margin: '0 15px 15px 0'
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
    const [exit, setExit] = React.useState(false)
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
        console.log(value)
        for (let elem of newChecked) {
            helpArr.push(elem.address)
        }
        const currentIndex = helpArr.indexOf(value.address);
        if (currentIndex === -1) {
            value.checkIcon = true
            newChecked.push(value)
        } else {
            value.checkIcon = false
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        console.log(newChecked)
    };

    const searchScales = () => {
        
        // setSearchWindowOpen(false)
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
                for (let scale of response.scales) {
                    if (scale.type.startsWith('PUE C315')) {
                        scale.foundImg = c315
                    } else if (scale.type.startsWith('HY 10')) {
                        scale.foundImg = hy10
                    } else if (scale.type.startsWith('WTC')) {
                        scale.foundImg = wtc
                    } else if (scale.type.startsWith('Pue 71') || props.scale.type.startsWith('PUE 71')) {
                        scale.foundImg = pue71
                    }
                }
                
                if (!exit) {

                    handleClickOpen(true)
                }
                
                setFoundScales(response.scales)
                if (response.updateScales && response.updateScales.length > 0) {

                    setUpdatedScales(response.updateScales)
                }
                setSearchWindowOpen(false)
                setLoader(false)
                setExit(false)
                props.setOpenSearch(true)

            } else if (response.respond === "SCALE_NOT_FOUND") {
                setLoader(false)
                setSearchWindowOpen(false)
                props.setOpenSearch(false)
                if (!exit) {
                    setAlert(true)
                    setExit(false)
                }

            }


        }
    }

    const addScales = () => {
        setSearchWindowOpen(true)
        setLoader(true)
        props.socket.send(JSON.stringify({ command: 'ADD_SCALES', scales: checked }))

        getScales()
            
        // props.drawerView('scales')
        setOpen(false)
        props.socket.onmessage = (e) => {
            let data = e.data;
            const response = JSON.parse(data);
            if (response.command === 'ADD_SCALES' && response.respond === 'OK') {
                console.log('xxxx',response)
                // props.yourScales()
                    // getScales()
                    setTimeout(() => {
                    props.setOpenSearch(false)
                    setSearchWindowOpen(false)
                    setLoader(false)
                    setExit(false)
                        props.drawerView('scales')
                    
                }, 1000)
            }
            
        }
        // setTimeout(() => {
        //     // props.setOpenSearch(false)
            
        // }, 4000)
    }

    const getScales = () => {
        fetch(`http://${props.host}:5000/scale`)
            .then(data => data.json())
            .then(data => {
                props.setScales(data);
                console.log(data)
                // setLoader(false)
            })
            .catch((err) => {

            })
    }

    React.useEffect(() => {
        searchScales()
        const login = (e) => {
            // console.log(e.keyCode)
            if (e.keyCode === 27) {
                setExit(true);
                setLoader(false);
                setSearchWindowOpen(false);
            }
        }

        document.addEventListener('keydown', login)
        return () => {
            document.removeEventListener('keydown', login)
        }
    }, [exit])

    React.useEffect(() => {
        console.log('cccc')
    }, [checked])

    return (
        <div>
            <Alert
                open={alert}
                // open={false}
                func={searchScales}
                close={props.setOpenSearch}
                lang={props.lang}
                context={'Nie znaleziono wag'}
            />
            <Dialog
                open={open}
                // open={true}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                // fullWidth={true}

                maxWidth={'lg'}
            >
                {/* <DialogTitle id="alert-dialog-title">{props.lang.scales}:</DialogTitle> */}
                <DialogContent>
                    <div style={{height:50, width: '100%', backgroundColor:'#3f51b5', color:'#fff', position:'absolute', left: 0, top: 0}}>
                        <h3 style={{paddingLeft:15}}>ZNALEZIONE WAGI:</h3>
                    </div>
                    {foundScales &&
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', paddingTop:50}}>
                            {foundScales.map((value, i) => {
                            // {[{ foundImg: pue71, checkIcon: false, address: '10.10.10.1', scaleName: 'C315', type: 'HY10' },
                            // { foundImg: wtc, checkIcon: false, address: '10.10.10.11', scaleName: 'C315', type: 'HY10' },
                            // { foundImg: hy10, checkIcon: false, address: '10.10.10.15', scaleName: 'Dupa', type: 'HY10' }
                            // ].map((value, i) => {
                                return (
                                    // <Tooltip title={`${props.lang.scale}: ${value.address}`} key={i}>

                                        <div className={`${classes.img} ${value.checkIcon && classes.test}`} onClick={handleToggle(value)} key={i} style={{ border: '1px solid rgb(0,0,0,0.25)',borderRadius:10, margin: 15, position: 'relative', width: 200, height: 200 }} >
                                            {value.checkIcon && <CheckIcon style={{ position: 'absolute', right: 0, margin: 10 }}></CheckIcon>}
                                            <div className={classes.check} ></div>
                                            <div style={{ textAlign: 'center', position: 'relative', top: '10px' }}>
                                                <img src={value.foundImg} width={100}></img>
                                                <h3 style={{ margin: 5 }}>{`${props.lang.scale}: ${value.name.length < 10 ? value.name : value.name.slice(0, 9) + '...'}`}</h3>

                                                <p style={{margin:0}}>{props.lang.type}: {value.type}</p>
                                                <p style={{margin:0}}>{props.lang.addressIp}: {value.address}</p>


                                            </div>
                                            <div style={{position:'relative', top:'-15px', padding: 5}}>

                                            </div>

                                        </div>
                                    // </Tooltip>
                                )
                            })}

                        </div>}




                </DialogContent>
                {updatedScales.length > 0&&<DialogTitle id="alert-dialog-title">{"Znaleziono:"}</DialogTitle>}
                <DialogActions>
                    <Button className={classes.button} onClick={handleClose} variant="contained" color="primary">
                        {props.lang.cancel}
                    </Button>
                    <Button className={classes.button} onClick={() =>addScales()} variant="contained" color="primary" autoFocus disabled={checked.length === 0}>
                        {props.lang.add}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={searchWindowOpen}
            >
                {/* <DialogTitle id="alert-dialog-title">{"Wyszukiwanie wag"}</DialogTitle> */}
                <DialogContent style={{ textAlign: 'center' }}>

                    {loader && <img src={reds} width={80} style={{ position: 'relative', top: -3 }}></img>}


                </DialogContent>
            </Dialog>

        </div>
    )
}