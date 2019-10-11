import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import RadwagIcon from '../img/radwag_bl.svg'
import data from '../Lang/pl';
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://radwag.com/" target="blank">
                Radwag
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}



const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    const classes = useStyles();
    const [guest, setGuest] = React.useState(false)
    const [login, setLogin] = React.useState({})
    const [error, setError] = React.useState(false)
    const showIcon = () => {
        let check = !guest
        setGuest(check)
    }

    useEffect(() => {
        const login = (e) => {
            if (e.keyCode === 13) {
                console.log(e)
                getUser()

            }
        }

        document.addEventListener('keydown', login)
        return () => {
            document.removeEventListener('keydown', login)
        }
    })
    const setValue = name => e => {
        // console.log(e.target.value)
        setLogin({...login, [name]:e.target.value})
    }
    const getUser = () => {
        if (!guest) {
            fetch('http://localhost:5000/login', {
                method: 'POST',
                body: JSON.stringify(login)
            })
            .then(user => user.json())
            
            .then(user => {
                if (Array.isArray(user) && user.length > 0) {
                    
                    setError(false)
                    props.setUser(user[0]); 
                    props.drawerView('scales')
                } else {
                    setError(true)
                }
            })
            .catch(err => console.log(err))

        } else {
            props.setUser({right:1, firstName: 'guest'})
            props.drawerView('scales')
        }
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {props.lang.login}
                </Typography>
                <form className={classes.form} noValidate>
                    {!guest&&<div>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            error={error}
                            fullWidth
                            onChange={setValue('userName')}
                            id="email"
                            label={props.lang.user}
                            name="email"
                            autoComplete="off"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            error={error}
                            name="password"
                            label={props.lang.password}
                            type="password"
                            id="password"
                            autoComplete="off"
                            onChange={setValue('password')}
                        />

                    </div>}
                    {guest&&<img src={RadwagIcon} width="70%"></img>}
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label={props.lang.loginAsGuest}
                        onChange={showIcon}
                    />
                    <Button
                        onClick={getUser}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {props.lang.login}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
                        </Grid>
                        <Grid item>
                            {/* <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link> */}
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}