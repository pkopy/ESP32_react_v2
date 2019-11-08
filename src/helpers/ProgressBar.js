import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import stableIcon from '../img/stable_black.svg';
import zeroIcon from '../img/zero.svg'
import taraIcon from '../img/tara_black.svg'

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    value: {
        flexGrow: 8,
        position: 'relative',
        fontSize: '6em',
        // bottom: '100%',
        fontWeight: 'bold',
        // color:'#fff',
        textAlign: 'right'

    },
    icons: {
        paddingTop: 8
    }
});

export default function LinearDeterminate(props) {
    const classes = useStyles();
    const [completed, setCompleted] = React.useState(0);
    const [Max, setMax] = React.useState(0)
    const [Value, setValue] = React.useState(0)
    const [ValueCal, setValueCal] = React.useState(0)
    const [Unit, setUnit] = React.useState('')
    const [isStab, setIsStab] = React.useState()
    const [isTare, setIsTare] = React.useState()
    const [isZero, setIsZero] = React.useState()
    const [precision, setPrecision] = React.useState()
    // const [maxMass, setMaxMass] = React.useState(props.maxMass)
    // console.log(props)

    React.useEffect(() => {

        // if (props.unit === 'g') {
        //     setMaxMass(parseFloat(props.maxMass) * 1000)
        // } else {
        //     setMaxMass(parseFloat(props.maxMass))
        // }
        if (props.socket.readyState === 1) {
            props.socket.send(JSON.stringify({ command: 'SCALE_STATUS', "scaleId": props.curentScale.id }))
            props.socket.onmessage = (e) => {
    
                let data = e.data;
                const response = JSON.parse(data);
                // console.log(response)
                // props.setRefresh(response)
                if (response.info) {
                    setMax(response.info.Max * 1)
                    setValue(response.info.NetAct.Value)
                    setUnit(response.info.NetAct.Unit)
                    setValueCal(response.info.NetCal.Value)
                    setIsStab(response.info.isStab)
                    setIsTare(response.info.isTare)
                    setIsZero(response.info.isZero)
                    setPrecision(response.info.NetAct.Precision)
    
                }
            }

        } else {
            console.log('socket disconnected')
        }

    }, [completed])

    React.useEffect(() => {

        function progress() {
            setCompleted(oldCompleted => {
                if (oldCompleted === 100) {
                    return 0;
                }


                const diff = Math.random() * 10;
                return Math.min(oldCompleted + diff, 100);
            });



        }

        const timer = setInterval(progress, 250);
        return () => {
            clearInterval(timer);
        };
    }, []);



    return (
        <div className={classes.root}>
            <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <div className={classes.icons}>{isStab && <img src={stableIcon} width={48}></img>}</div>
                    <div className={classes.icons}>{isZero && <img src={zeroIcon} width={48}></img>}</div>
                    <div className={classes.icons}>{isTare && <img src={taraIcon} width={48}></img>}</div>
                </div>
                <div className={classes.value}>{Number.parseFloat(Value).toFixed(precision)} {Unit !== "NoUnit" && <span>{Unit}</span>}</div>

            </div>
            <LinearProgress color="primary" variant="determinate" value={ValueCal > 0 ? (100 / (Max / ValueCal)) : 0} style={{ height: '40px' }} />
        </div>
    );
}