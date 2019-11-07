import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ProgressBar from '../helpers/ProgressBar'
import SocketLib from '../Socket'
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { height } from '@material-ui/system';
import LastMeasurementChart from '../Scales/LastMeasurementChart'



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
        justifyContent: 'center',

        height: '40vh'
    },
    img: {
        display: 'flex',
        flexDirection: 'column',
        width: '45%',
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(2),
    }

}));

export default function PaperSheet(props) {
    const classes = useStyles();
    const [connection, setConnection] = useState(props.socket)
    const [button, setButton] = useState(true)
    const [measure, setMeasure] = useState()
    const [unit, setUnit] = useState()
    const [maxMass, setMaxMass] = useState()
    console.log(props)
    // React.useEffect(() => {
        
    //     freeMeasurements()
    // },[])
    
    // React.useEffect(() => {
    //     function x() {
    //         connection.send(JSON.stringify({ command: 'SCALE_STATUS', "scaleId": props.curentScale.id }))
    //         // console.log('xxxxxx')

    //     }
    //     const interval =  setInterval(x,300)

    //     return () => {
    //         clearInterval(interval)
    //     }
    // },[])

    function freeMeasurements() {

        // if (SocketLib.connection) {

        //     console.log(SocketLib.connection)
        // }

        // const x = SocketLib.connectToSocket(props.curentScale.address, props.curentScale.port)
        // connection.onclose = () => {

        //     alert('soket niedostępnty')

        // }

        // x.onopen = () => {
        //     console.log('Gruuuauauua')
        //     SocketLib.connection = x
        //     setConnection(x)
        //     x.send(JSON.stringify({ command: 'SCALE_STATUS', "scaleId": 20 }), x)
        //     setButton(false)
        // }
        // connection.onopen = () =>{
        //     // console.log('Gruuuauauua')
            
            
        //     setButton(false)
        // }
        

        // setTimeout(() => {


        // }, 500)

    //    connection.onmessage = (e) => {
    //         let data = e.data;
    //         const measure = JSON.parse(data);
    //         console.log(measure)
    //         setMeasure(measure.mass)
    //         setUnit(measure.unit)
    //         setMaxMass(parseFloat(measure.maxMass))

    //     }
    }

    function stopConnection() {
        // if (connection) {

        //     connection.send(JSON.stringify({ command: 'STOP' }));
        //     connection.close();
        //     setButton(true);
        //     props.setMeasure('0.0');
        // }
    }

    function showScales() {
        // if (connection) {
        //     stopConnection();
        // }
        props.drawerView('scales');
    }

    // React.useEffect(() => {
    //     if (connection) {

    //         connection.close();
    //     }
    // })

    return (
        <div>
            
            {/*<Paper className={classes.root}>
                <ProgressBar
                    value={measure}
                    unit={unit}
                    maxMass={maxMass}
                    setMaxMass={setMaxMass}
                />
            </Paper>
             <Button className={classes.button} variant="outlined" color="primary" onClick={button ? freeMeasurements : stopConnection}>
                {button ? props.lang.start : props.lang.stop}
            </Button> 
            <Button className={classes.button} variant="outlined" color="primary" onClick={showScales}>
                {props.lang.back}
            </Button>*/}
            <div className={classes.details}>
                <Paper className={classes.img}>
                    {/* <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.name}</h1> */}
                    <div style={{display:'flex'}}>
                        <div style={{padding:'2em'}}>

                            <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.status==='Offline'?<b style={{color:'red'}}>{props.curentScale.status}</b>:<b style={{color:'green'}}>{props.curentScale.status}</b>}</h1>
                        </div>
                        {/* <div>
                            <img src={props.curentScale.img} width={150}></img>

                        </div> */}

                    </div>
                    <div style={{marginTop:'auto', marginBottom:'4em'}}>
                        
                        <ProgressBar
                            socket={props.socket}
                            value={measure}
                            unit={unit}
                            maxMass={maxMass}
                            setMaxMass={setMaxMass}
                            curentScale={props.curentScale}
                        />
                    </div>
                </Paper>
                <Paper className={classes.img}>
                    <div style={{padding:'2em', display:'flex'}}>
                        <div style={{marginRight:'2em'}}>
                            <img src={props.curentScale.img} width={200}></img>
                        </div>
                        <div style={{textAlign:'left'}}>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.lang.connType}:</h1>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.lang.addressIp}:</h1>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.lang.connType}:</h1>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.lang.serial}:</h1>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.lang.type}:</h1>
                        </div>
                        <div style={{textAlign:'left', marginLeft:'2em', color: '#3f51b5'}}>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.connType}</h1>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.address}</h1>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.connType}</h1>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.serial}</h1>
                            <h1 style={{margin:0, marginLeft: 10}}>{props.curentScale.type}</h1>
                        </div>
                        

                    </div>
                    
                </Paper>
                

            </div>
            <div className={classes.details}>
                <Paper className={classes.img}>
                    <LastMeasurementChart
                        scaleId={props.curentScale.id}
                        chart={true}
                    ></LastMeasurementChart>
                </Paper>
                <Paper className={classes.img}>
                <LastMeasurementChart
                        scaleId={props.curentScale.id}
                        chart={false}
                    ></LastMeasurementChart>
                </Paper>
                </div>
        </div>
    );
}
