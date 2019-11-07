import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import esp32 from '../img/esp32.jpg'
import c315 from '../img/C315.png'
import DeleteIcon from '@material-ui/icons/Delete';
import DetailsIcon from '@material-ui/icons/Details';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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
        paddingTop: '56.25%', // 16:9
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
        if (props.socket.readyState === 1) {

            props.drawerView('freeWeighing')
            scale.img = img
            props.setCurrentScale(scale)
            console.log(scale)
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        if (props.scale.name.startsWith('C315')) {
            setImg(c315)
        } else {
            setImg(esp32)
        }
    },[props.scale])

    return (
        <Card className={classes.card}>
            <CardHeader
                // avatar={
                //     <Avatar aria-label="recipe" className={classes.avatar}>
                //        {props.scale.name.slice(0,4)}
                //     </Avatar>
                // }
                // action={
                //     <IconButton aria-label="settings">
                //         <MoreVertIcon onClick={handleClick}/>
                //     </IconButton>
                // }
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
                    {props.lang.scale}: {props.scale.name}
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
                <IconButton aria-label="add to favorites" onClick={() => startWeighing(props.scale)}>
                    <InfoOutlinedIcon />
                </IconButton>
                <IconButton aria-label="share" disabled={true}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}