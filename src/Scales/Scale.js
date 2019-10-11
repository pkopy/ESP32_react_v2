import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import esp32 from '../img/esp32.jpg'
import c315 from '../img/C315.png'
import DeleteIcon from '@material-ui/icons/Delete';
import DetailsIcon from '@material-ui/icons/Details';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 300,
        minWidth:250,
        margin: 10
    },
    media: {
        height: 0,
        width: '70%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: '56.25%', // 16:9
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

    function startWeighing(scale) {
        props.drawerView('freeWeighing')
        props.setCurrentScale(scale)
    }

    const [img, setImg] = React.useState()

    useEffect(() => {
        if (props.scale.name.startsWith('C315')) {
            setImg(c315)
        } else {
            setImg(esp32)
        }
    })

    return (
        <Card className={classes.card}>
            <CardHeader
                // avatar={
                //     <Avatar aria-label="recipe" className={classes.avatar}>
                //        {props.scale.name.slice(0,4)}
                //     </Avatar>
                // }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={props.scale.name}
                subheader={props.scale.address}
            />
            <CardMedia
                className={classes.media}
                image={img}
                title="Scale"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.lang.scale}: {props.scale.name}
                </Typography> <Typography variant="body2" color="textSecondary" component="p">
                    {props.lang.addressIp}: {props.scale.address}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">

                    {props.lang.port}: {props.scale.port}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={() => startWeighing(props.scale)}>
                    <DetailsIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}