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
    const [connection, setConnection] = useState(false)
    const [button, setButton] = useState(true)
    const [measure, setMeasure] = useState()
    const [refresh, setRefresh] = useState()
    const [scaleStatus, setScaleStatus] = React.useState()
    const [maxMass, setMaxMass] = useState()
    const [timer, setTimer] = useState({})
    // console.log(props)
    // let timer = {}
    
    const [socket, setSocket] = useState({})

    const sock= new WebSocket('ws://10.10.3.141:4000')


    const syncMeasurement = () => {
        if (socket.readyState === 1) {

            socket.send(JSON.stringify({ command: 'DOWNLOAD_WEIGHINGS', "scaleId": props.curentScale.id }))
            props.socket.onmessage = (e) => {
                let data = e.data;
                const response = JSON.parse(data);
                console.log(response)
            }
    
            console.log('start sync')
        }
        // setTimer(setInterval(weighingsStatus, 2000))
        
    }

    const cancelSync = () => {
        console.log('stop sync')

        if (socket.readyState === 1) {
            socket.send(JSON.stringify({ command: 'CANCEL_OPERATION', "scaleId": props.curentScale.id }))
            
            socket.onmessage = (e) => {
                let data = e.data;
                const response = JSON.parse(data);
                console.log('cancel sync: ',response)
                
                // clearInterval(timer)
            }
            socket.onerror = () => {
                // clearInterval(timer)
            }
        
            
        }
        // clearInterval(timer)
    }

    const weighingsStatus = () => {
        
        console.log('xxx')
        if (sock.readyState === 1) {
            setSocket(sock)
            setConnection(true)
            sock.send(JSON.stringify({ command: 'WEIGHINGS_STATUS', "scaleId": props.curentScale.id }))
            sock.onmessage = (e) => {
                let data = e.data;
                const response = JSON.parse(data);
                setScaleStatus(response)
            }
            // console.log('weighingsStatus', scaleStatus)
            
        }
    }

    

    React.useEffect(() => {
        const timer = setInterval(weighingsStatus, 250);
        return () => {
            clearInterval(timer);
            // socket.close()
        };
        // weighingsStatus()
        // weighingsStatus()
    },[])
    

    return (
        <div>

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
                            // maxMass={maxMass}
                            // setMaxMass={setMaxMass}
                            curentScale={props.curentScale}
                            // setRefresh={setRefresh}
                            // setScaleStatus={setScaleStatus}
                        />
                    </div>
                </Paper>
                <Paper className={classes.img}>
                    <div style={{padding:'2em', display:'flex', height:'100%'}}>
                        {/* <div style={{marginRight:'2em'}}>
                            <img src={props.curentScale.img} width={200}></img>
                            {scaleStatus&&<div><p>{scaleStatus.info.WeighingsInfo.inScale}</p>
                                <p>{scaleStatus.info.WeighingsInfo.max}</p>  
                                <p>{scaleStatus.info.WeighingsInfo.inDatabase}</p>  </div>   
                            }
                        </div> */}
                        <div style={{textAlign:'left'}}>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.lang.connType}:</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.lang.addressIp}:</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.lang.connType}:</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.lang.serial}:</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.lang.type}:</h3>

                            <br></br>
                            <h3 style={{margin:0, marginLeft: 10}}>RECORDS:</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>In scale:</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>In database:</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>Max records:</h3>
                            <Button variant='outlined' onClick={syncMeasurement} style={{marginLeft:10, marginTop:15}} disabled={!connection}>SYNC</Button>
                            <Button variant='outlined' onClick={cancelSync} style={{marginLeft:10, marginTop:15}}>CANCEL</Button>
                        </div>
                        <div style={{textAlign:'left', marginLeft:'2em', color: '#3f51b5'}}>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.curentScale.connType}</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.curentScale.address}</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.curentScale.connType}</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.curentScale.serial}</h3>
                            <h3 style={{margin:0, marginLeft: 10}}>{props.curentScale.type}</h3>
                            <br></br>
                            <br></br>
                            
                            {scaleStatus&&scaleStatus.weighingsInfo&&<h3 style={{margin:0, marginLeft: 10}}>{scaleStatus.weighingsInfo.inScale}</h3>}
                            {scaleStatus&&scaleStatus.weighingsInfo&&<h3 style={{margin:0, marginLeft: 10}}>{scaleStatus.weighingsInfo.inDatabase}</h3>}
                            {scaleStatus&&scaleStatus.weighingsInfo&&<h3 style={{margin:0, marginLeft: 10}}>{scaleStatus.weighingsInfo.max}</h3>}
                            {scaleStatus&&scaleStatus.weighingsInfo&&scaleStatus.weighingsInfo.Progress&&<h3>PROGRESS</h3>}
                        </div>
                        <div style={{height:'100%', borderLeft:'1px solid rgba(0,0,0,0.25)', marginLeft:'2em', marginRight:'2em' }}></div>
                        <div>
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
