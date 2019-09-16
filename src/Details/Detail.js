import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ProgressBar from '../helpers/ProgressBar'
import SocketLib from '../Socket'
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Scale from '../Scales/Scale';



const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: '30px'
    },
    button: {
        marginTop:'30px',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    details: {
        display:'flex',
    }
    
}));

export default function PaperSheet(props) {
    const classes = useStyles();
    const [connection, setConnection] = React.useState()
    const [button, setButton] = React.useState(true)
    
    // React.useEffect(() => {
    //     console.log(connection)
    //     return function cleanup() {
    //         if (connection) {

    //             stopConnection()
    //         }
    //     }
    // })
    // const x = SocketLib.connectToSocket('10.10.1.71')
    // // console.log(connection)
    // setConnection(x)
    // const [measure, setMeasure] = React.useState('0.0')
    
    // connection.onmessage = (e) => {
        // let data = e.data;
        // const measure = JSON.parse(data);
        // setMeasure(measure.measure)
        // console.log(measure.measure)
    // }
    // console.log(connection)
    function freeMeasurements() {
        // const socketsConns = Object.keys(connection)
        // const x = SocketLib.connectToSocket(props.curentScale.address)
        if (SocketLib.connection) {

            console.log(SocketLib.connection)
        }
        // if (SocketLib.connection && !SocketLib.connection['url'].startsWith(`ws://${props.curentScale.address}`)) {
        //     console.log(`ws://${props.curentScale.address}:7000`)
        //     SocketLib.connection.close()
        // }
        const x = SocketLib.connectToSocket(props.curentScale.address)
        
        // console.log(SocketLib.connection)
        // connection[props.curentScale.address] = x
        setConnection(x)
        // console.log(x)
        setTimeout(() => {

            x.send(JSON.stringify({command:'C'}), x)
        },500)
        // console.log(x)
        x.onmessage = (e) => {
            let data = e.data;
            const measure = JSON.parse(data);
            props.setMeasure(measure.measure)
            // console.log(measure.measure)
        }
        x.onerror = (err) => {
            console.log(err)
        }
        setButton(false)
    }
    function stopConnection() {
        connection.send(JSON.stringify({command:'STOP'}));
        connection.close();
        setButton(true);
        props.setMeasure('0.0');
    }

    function showScales() {
        if (connection) {
            console.log(connection)
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
                <div className={classes.details}>
                    <Avatar aria-label="recipe" className={classes.avatar}>
                            R
                    </Avatar>
                    <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.name}</h1>
                    {/* <Scale
                        scale={props.curentScale}
                    /> */}
                </div>
            </Paper>
            <Button className={classes.button} variant="outlined" color="primary" onClick={button?freeMeasurements:stopConnection}>
                {/* {errors.errors ? <span>Popraw</span> : <span>Zamknij</span>} */}
                {button?'URUCHOM':'ZATRZYMAJ'}
            </Button>
            <Button className={classes.button} variant="outlined" color="primary" onClick={showScales}>
                POWRÓT
            </Button>
        </div>
    );
}
