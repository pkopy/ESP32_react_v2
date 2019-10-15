import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ProgressBar from '../helpers/ProgressBar'
import SocketLib from '../Socket'
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';



const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: '30px'
    },
    button: {
        marginTop: '30px',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    details: {
        display: 'flex',
        justifyContent: 'center'
    },
    img: {
        width: 400,
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(2),
    }

}));

export default function PaperSheet(props) {
    const classes = useStyles();
    const [connection, setConnection] = React.useState()
    const [button, setButton] = React.useState(true)

    React.useEffect(() => {

    })

    function freeMeasurements() {

        if (SocketLib.connection) {

            // console.log(SocketLib.connection)
        }

        const x = SocketLib.connectToSocket(props.curentScale.address, props.curentScale.port)
        x.onerror = () => {
            alert('soket niedostępnty')

        }

        x.onopen = () => {
            setConnection(x)
            x.send(JSON.stringify({ command: 'C' }), x)
            setButton(false)
        }

        setTimeout(() => {


        }, 500)

        x.onmessage = (e) => {
            let data = e.data;
            const measure = JSON.parse(data);
            props.setMeasure(measure.measure)
        }
    }

    function stopConnection() {
        if (connection) {

            connection.send(JSON.stringify({ command: 'STOP' }));
            connection.close();
            setButton(true);
            props.setMeasure('0.0');
        }
    }

    function showScales() {
        if (connection) {
            stopConnection();
        }
        props.drawerView('scales');
    }

    return (
        <div>
            
            <Paper className={classes.root}>
                <ProgressBar
                    value={props.measure}
                />
                {/* <div className={classes.details}>
                    <Avatar aria-label="recipe" className={classes.avatar}>
                            R
                    </Avatar>
                    <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.name}</h1>
                </div> */}
            </Paper>
            <Button className={classes.button} variant="outlined" color="primary" onClick={button ? freeMeasurements : stopConnection}>
                {/* {errors.errors ? <span>Popraw</span> : <span>Zamknij</span>} */}
                {button ? props.lang.start : props.lang.stop}
            </Button>
            <Button className={classes.button} variant="outlined" color="primary" onClick={showScales}>
                {props.lang.back}
            </Button>
            <div className={classes.details}>
                <Paper className={classes.img}>
                    {/* <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.name}</h1> */}
                    <img src={props.curentScale.img} width={250}></img>
                </Paper>
                <Paper className={classes.img}>
                    <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.status}</h1>
                    {/* <img src={props.curentScale.img} width={250}></img> */}
                </Paper>
                <Paper className={classes.img}>
                    {/* <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.name}</h1> */}
                    <img src={props.curentScale.img} width={250}></img>
                </Paper>

            </div>
        </div>
    );
}
