import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';
import Scale from './Scale'




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
            backgroundColor:'#fff'
        }
    },
    title: {
        paddingBottom: '30px',
        fontFamily:'Roboto'
    }
}))


export default function Scales(props) {
    const classes = useStyles();

    return (
        <div>
            <Typography variant="h4" className={classes.title} >
                {props.lang.scales}
            </Typography>
            <div className={classes.container}>
                {props.scales.map(elem => 
                    <Scale key={elem.address}
                        scale={elem}
                        lang={props.lang}
                        drawerView={props.drawerView}
                        setCurrentScale={props.setCurrentScale}
                    />
                )}
            </div>

        </div>

    )

}