import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { relative } from 'path';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '80px'
    },
    value: {
        position: 'relative',
        fontSize: '4em',
        bottom: '100%',
        fontWeight: 'bold',
        color:'#fff'
  }
});

export default function LinearDeterminate(props) {
    const classes = useStyles();
    const [completed, setCompleted] = React.useState(0);
    // console.log(props)
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
            {/* <LinearProgress variant="determinate" value={completed} />
      <br /> */}
            <LinearProgress color="primary" variant="determinate" value={props.value > 0 ? (100 / (3100 / props.value)) : 0} style={{ height: '80px' }} />
            <div className={classes.value}>{props.value} g</div>
        </div>
    );
}