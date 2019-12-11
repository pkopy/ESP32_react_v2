import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import esp32 from '../img/esp32.jpg'
import wtc from '../img/wtc.png'
import c315 from '../img/C315.png'
import hy10 from '../img/scale_hy10.png';
import pue71 from '../img/pue71.png'
import DeleteIcon from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { Hidden } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 250,
        minWidth: 200,
        margin: 10,

    },
    media: {
        height: 0,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        image:'',
        padding: '40%', // 16:9
        '&:hover': {
            cursor: 'pointer'
        }
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: '#6666fb',
    },
}));

export default function RecipeReviewCard(props) {
    const classes = useStyles();
    const [img, setImg] = React.useState()

    function startWeighing(scale) {
        // if (props.socket.readyState === 1) {

            props.drawerView('freeWeighing')
            scale.img = img
            props.setCurrentScale(scale)
            console.log(scale)
         // }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const hidden = (scale) => {
        console.log(scale)
        props.setLoader(true)
        props.socket.send(JSON.stringify({command:"HIDE_SCALE", scaleId: scale.id}))
        setTimeout(() => {
            props.setLoader(false)
        },3000)
    }


    useEffect(() => {
        if (props.scale.type.startsWith('PUE C315')) {
            setImg(c315)
        } else if (props.scale.type.startsWith('HY 10')){
            setImg(hy10)
        } else if (props.scale.type.startsWith('WTC')) {
            setImg(wtc)
        } else if (props.scale.type.startsWith('Pue 71')) {
            setImg(pue71)
        }
    },[props.scale])

    return (
        <Card className={classes.card}>
            <CardHeader
                title={props.scale.name}
                subheader={props.scale.address}
            />
            <CardMedia
                className={classes.media}
                src={''}
                image={img}
                title={props.scale.name}
                onClick={() => startWeighing(props.scale)}
            />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.lang.scale}: {props.scale.type}
                </Typography> <Typography variant="body2" color="textSecondary" component="p">
                    {props.lang.addressIp}: {props.scale.address}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">

                    {props.lang.port}: {props.scale.port}
                </Typography>
                <Typography  color="textSecondary" component="h6">

                     {props.scale.status==='Offline'?<b style={{color:'red'}}>{props.scale.status}</b>:<b style={{color:'green'}}>{props.scale.status}</b>}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton  onClick={() => startWeighing(props.scale)}>
                    <InfoOutlinedIcon />
                </IconButton>
                <IconButton aria-label="share" onClick={() => hidden(props.scale)}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}