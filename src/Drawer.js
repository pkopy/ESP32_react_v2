import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SettingsIcon from '@material-ui/icons/Settings';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import MailIcon from '@material-ui/icons/Mail';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import NewOrder from './Details/NewOrder'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Scales from './Scales/Scales'
import OrdersList from './Details/OrdersList'
import Detail from './Details/Detail'
import OrderDetails from './Details/OrderDetails'
import Groups from './ItemTree/Groups'
import Operators from './Operators/Operators'
import AllMeasurements from './Details/AllMeasurments'
import Settings from './Settings/Settings'
import Contaractors from './Contractors/Contractors'
import Avatar from '@material-ui/core/Avatar';
import Login from './Login/Login1'
import SocketLib from './Socket'
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { ThemeProvider } from '@material-ui/styles';
import { indigo, deepOrange } from '@material-ui/core/colors';
import PowerIcon from '@material-ui/icons/Power';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { Tooltip } from '@material-ui/core';
import reds from './img/3xred.gif'
import UndoIcon from '@material-ui/icons/Undo';
import SearchAndAddScales from './Scales/SearchAndAddScales';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',

    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    avatar: {

        // right: theme.spacing(2),
        backgroundColor: deepOrange[500]
    },
    socketStaus: {
        display: 'flex',
        position: "absolute",
        right: theme.spacing(4),
    },
    undo: {
        marginRight: theme.spacing(1),
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));



export default function PersistentDrawerLeft(props) {
    const classes = useStyles();
    // const theme = useTheme();
    const [color, setColor] = React.useState()
    const [user, setUser] = React.useState({})
    const [connection, setConnection] = React.useState()
    const [openSearch, setOpenSearch] = React.useState(false)
    const [open, setOpen] = React.useState(false);
    const [order, setOrder] = React.useState()
    const [curentScale, setCurrentScale] = React.useState({})
    const [currentOrder, setCurrentOrder] = React.useState({})
    const [home, setHome] = React.useState(false)
    const [scales, setScales] = React.useState(false)
    // const [alert,setAlert] = React.useState({visible:true, title:'Alert', context:'To jest test'})
    const [view, setView] = React.useState({
        login: true,
        order: false,
        details: false,
        scales: false,
        ordersList: false,
        freeWeighing: false,
        orderDetails: false,
        items: false,
        name: props.lang.login,
        allMeasurements: false,
        operators: false,
        settings: false
    })

    const theme = createMuiTheme({
        palette: {
            primary: color,
        },
    });

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    function search() {
        // drawerView('details')
        // props.findScales()
        setColor(green)
        // handleDrawerClose()
    }

    function myScales() {
        // props.yourScales()
        drawerView('scales')
    }

    function myOrders() {
        props.orders()
        drawerView('ordersList')
    }
    function myMeasurements() {
        // props.orders()
        drawerView('allMeasurements')
    }
    function myOperators() {
        // props.orders()
        drawerView('operators')
    }

    function viewOrder(order) {
        drawerView('order')
        setOrder(order)
    }
    const getScales = () => {
        fetch(`http://${props.host}:5000/scale`)
            .then(data => data.json())
            .then(data => {
                setScales(data);
                console.log(data)
                // setLoader(false)
            })
            .catch((err) => {

            })
    }

    useEffect(() => {
        getScales()
    }, [])

    

    function drawerView(name) {
        const valuesKeys = Object.keys(view)
        const helpView = {}
        for (let value of valuesKeys) {
            if (value !== name) {
                helpView[value] = false
            } else {
                helpView[value] = true
            }
        }

        setHome(name)
        switch (name) {
            case 'items':
                helpView.name = props.lang.items;
                break;
            case 'operators':
                helpView.name = props.lang.operators;
                break;
            case 'ordersList':
                helpView.name = props.lang.orders;
                break;
            case 'allMeasurements':
                helpView.name = props.lang.allMeasurement;
                break;
            case 'scales':
                helpView.name = props.lang.scales;

                break;
            case 'settings':
                helpView.name = props.lang.settings;
                break;
            case 'order':
                helpView.name = props.lang.newOrder;
                break;
            case 'orderDetails':
                helpView.name = props.lang.orderDetails;
                break;
            case 'freeWeighing':
                helpView.name = props.lang.details;
                break;
            default:
                helpView.name = props.lang.login;

        }

        setOrder({})
        setView(helpView)
        // handleDrawerClose()

    }

    return (


        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar >
                        {user.right > 0 && <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            id="menu_drawer"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>}
                        <Typography variant="h6" noWrap className={"menu_title"}>
                            E2R LITE -
                        </Typography>
                        {view.name && <Typography variant="h6" noWrap className={"menu_title"}>
                            &nbsp;{view.name.toUpperCase()}
                        </Typography>}
                        {/* <PowerIcon fontSize="large" style={{color:'green'}}></PowerIcon> */}
                        <div className={classes.socketStaus}>
                            <div>
                                {props.socketStatus && home === 'scales' && <Tooltip title={props.lang.search}>
                                    <AddIcon  className={classes.undo} onClick={() => { console.log('addddd'); setOpenSearch(!openSearch) }}></AddIcon>
                                </Tooltip>}

                                {(home && home !== 'scales') && <Tooltip title={props.lang.back}>
                                    <HomeIcon  className={classes.undo} onClick={() => drawerView('scales')}></HomeIcon>
                                </Tooltip>}

                                {props.connection && <img src={reds} width={34}></img>}
                                
                                {user.right > 1 && <Tooltip title={props.lang.logout}>
                                    {<PowerSettingsNewIcon className={classes.undo} onClick={() => { setUser({}); console.log('home', home); drawerView('login'); setHome(false) }}  color='inherit'></PowerSettingsNewIcon> }
                                </Tooltip>}

                                {!props.connection && <Tooltip title={props.socketStatus ? 'Socket connected' : 'Socket disconnected'}>
                                    {props.socketStatus ? <LinkIcon   color='inherit'></LinkIcon> : <LinkOffIcon onClick={() => props.resetSocket()}  color='inherit'></LinkOffIcon>}
                                </Tooltip>}


                            </div>
                            {/* <div>
                                {user.firstName && <Avatar aria-label="recipe" className={classes.avatar}>
                                    {user.firstName[0].toUpperCase()}
                                </Avatar>}

                            </div> */}

                        </div>

                        {/* <IconButton>
                        E2R LITE
                    </IconButton> */}
                    </Toolbar>
                </AppBar>
                <Drawer

                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />


                    <List>
                        {/* <ListItem button onClick={search}>
                        <ListItemIcon><SearchIcon color="primary"/></ListItemIcon>
                        <ListItemText primary='Szukaj' />
                    </ListItem> */}
                        <ListItem button onClick={() => drawerView('items')}>
                            <ListItemIcon><AddCircleOutlineIcon color="primary" /></ListItemIcon>
                            <ListItemText primary={props.lang.items} />
                        </ListItem>
                        {user.right > 2 && <ListItem button onClick={myOperators}>
                            <ListItemIcon><SupervisorAccountIcon color="primary" /></ListItemIcon>
                            <ListItemText primary={props.lang.operators} id="operators" />
                        </ListItem>}
                    </List>
                    <Divider />
                    <List>
                        {user.right > 1 && <ListItem button onClick={myOrders}>
                            <ListItemIcon><FormatListBulletedIcon color="primary" /></ListItemIcon>
                            <ListItemText primary={props.lang.orders} />
                        </ListItem>}
                        {/* <ListItem button onClick={() => drawerView('order')}>
                        <ListItemIcon><AddCircleOutlineIcon color="primary"/></ListItemIcon>
                        <ListItemText primary='Nowe zlecenie' />
                    </ListItem> */}
                        {user.right > 1 && <ListItem button onClick={myMeasurements}>
                            <ListItemIcon><SupervisorAccountIcon color="primary" /></ListItemIcon>
                            <ListItemText primary={props.lang.allMeasurement} />
                        </ListItem>}
                    </List>
                    {user.right > 1 && <Divider />}
                    <List>
                        <ListItem button onClick={myScales}>
                            <ListItemIcon><InboxIcon color="primary" /></ListItemIcon>
                            <ListItemText primary={props.lang.scales} />
                        </ListItem>
                        <ListItem button onClick={() => drawerView('settings')}>
                            <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                            <ListItemText primary={props.lang.settings} />
                        </ListItem>
                        <ListItem button onClick={() => { setUser({}); setHome(); drawerView('login') }}>
                            <ListItemIcon><PowerSettingsNewIcon color="primary" /></ListItemIcon>
                            <ListItemText primary={props.lang.logout} />
                        </ListItem>

                    </List>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />

                    {view.scales && <Scales
                        lang={props.lang}
                        scales={scales}
                        setOpenSearch={setOpenSearch}
                        drawerView={drawerView}
                        setCurrentScale={setCurrentScale}
                        socket={props.socket}
                        socketStatus={props.socketStatus}
                        host={props.host}
                        setScales={setScales}
                        

                    />}

                    {openSearch && <SearchAndAddScales
                        setOpenSearch={setOpenSearch}
                        socket={props.socket}
                        lang={props.lang}
                        host={props.host}
                        setScales={setScales}
                        drawerView={drawerView}
                    />}



                    {view.ordersList && user.right > 1 && <OrdersList
                        yourOrders={props.yourOrders}
                        viewOrder={viewOrder}
                        setCurrentOrder={setCurrentOrder}
                        drawerView={drawerView}
                        orders={props.orders}
                        lang={props.lang}
                        user={user}
                        socket={props.socket}
                        host={props.host}
                    />}



                    {view.order && <NewOrder
                        address={props.address}
                        scales={props.scales}
                        order={order}
                        setCurrentOrder={setCurrentOrder}
                        operators={props.operators}
                        drawerView={drawerView}
                        lang={props.lang}
                        user={user}
                        socket={props.socket}
                        host={props.host}
                    />}

                    {view.freeWeighing && <Detail
                        curentScale={curentScale}
                        drawerView={drawerView}
                        measure={props.measure}
                        setMeasure={props.setMeasure}
                        lang={props.lang}
                        socket={props.socket}
                        host={props.host}
                    />}
                    {view.orderDetails && <OrderDetails
                        data={currentOrder}
                        drawerView={drawerView}
                        viewOrder={viewOrder}
                        order={order}
                        lang={props.lang}
                        host={props.host}
                        socket={props.socket}
                        orderDetails={currentOrder}
                    />}
                    {view.allMeasurements && <AllMeasurements
                        drawerView={drawerView}
                        lang={props.lang}
                        user={user}
                        host={props.host}
                    />}
                    {view.operators && <Operators
                        drawerView={drawerView}
                        updateOperators={props.updateOperators}
                        lang={props.lang}
                        host={props.host}
                    ></Operators>}

                    {view.items && <Groups
                        lang={props.lang}
                        drawerView={drawerView}
                        user={user}
                        host={props.host}
                    />}
                    <Typography paragraph>

                    </Typography>

                    {view.settings && <Settings
                        setColor={setColor}
                        drawerView={drawerView}
                        lang={props.lang}
                        changeLang={props.changeLang}
                        host={props.host}
                    />}

                    {view.login && <Login
                        lang={props.lang}
                        user={user}
                        setUser={setUser}
                        drawerView={drawerView}
                        host={props.host}
                    >

                    </Login>}

                    {/* <Contaractors/> */}
                    {/* <TextF
                    title={'okokoko'}
                /> */}
                </main>
            </div>
        </ThemeProvider>
    );
}
