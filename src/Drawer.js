import React from 'react';
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
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import MailIcon from '@material-ui/icons/Mail';
import SearchIcon from '@material-ui/icons/Search';
// import Details from './Details/Details'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import NewOrder from './Details/NewOrder'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Scales from './Scales/Scales'
import OrdersList from './Details/OrdersList'
import Detail from './Details/Detail'
import OrderDetails from './Details/OrderDetails'
import Groups from './ItemTree/Groups'
import TextF from './MyComponents/TextFieldwithTitle'
// import './Details/OrderDetails.scss'


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
}));

export default function PersistentDrawerLeft(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [order, setOrder] = React.useState()
    const [curentScale, setCurrentScale] = React.useState({})
    const [currentOrder, setCurrentOrder] = React.useState({})
    const [view, setView] = React.useState({
        order: false,
        details: false,
        scales: true,
        ordersList:false,
        freeWeighing:false,
        orderDetails: false,
        items: false,
        name:''
    })

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    function search() {
        // drawerView('details')
        props.findScales()
        // handleDrawerClose()
    }

    function myScales () {
        props.yourScales()
        drawerView('scales')
    }

    function myOrders () {
        props.orders()
        drawerView('ordersList')

    }
    
    function viewOrder (order) {
        drawerView('order')
        setOrder(order)
    }

    

    function drawerView(name) {
        // console.log(props.newOrder)
        const valuesKeys = Object.keys(view)
        const helpView = {}
        for (let value of valuesKeys) {
            if (value !== name) {
                helpView[value] = false
            } else {
                helpView[value] = true
            }
        }
        helpView.name = name
        setOrder({})
        setView(helpView)
        console.log(view.name)
        handleDrawerClose()

    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        E2R LITE - 
                    </Typography>
                    <Typography variant="h6" noWrap>
                    &nbsp;{view.name}
                    </Typography>
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
                    <ListItem button onClick={search}>
                        <ListItemIcon><SearchIcon color="primary"/></ListItemIcon>
                        <ListItemText primary='Szukaj' />
                    </ListItem>
                    <ListItem button onClick={myScales}>
                        <ListItemIcon><InboxIcon color="primary"/></ListItemIcon>
                        <ListItemText primary='Twoje wagi (ESP32)' />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={myOrders}>
                        <ListItemIcon><FormatListBulletedIcon color="primary"/></ListItemIcon>
                        <ListItemText primary='Twoje zlecenia' />
                    </ListItem>
                    {/* <ListItem button onClick={() => drawerView('order')}>
                        <ListItemIcon><AddCircleOutlineIcon color="primary"/></ListItemIcon>
                        <ListItemText primary='Nowe zlecenie' />
                    </ListItem> */}
                    <ListItem button onClick={myOrders}>
                        <ListItemIcon><SupervisorAccountIcon color="primary"/></ListItemIcon>
                        <ListItemText primary='Operatorzy' />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    
                    <ListItem button onClick={() => drawerView('items')}>
                        <ListItemIcon><AddCircleOutlineIcon color="primary"/></ListItemIcon>
                        <ListItemText primary='Towary' />
                    </ListItem>
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />

                {view.scales&&<Scales
                    scales={props.scales}
                    drawerView={drawerView}
                    setCurrentScale={setCurrentScale}
                />}

                {view.ordersList&&<OrdersList 
                    yourOrders={props.yourOrders}
                    viewOrder={viewOrder}
                    setCurrentOrder={setCurrentOrder}
                    drawerView={drawerView}
                    orders={props.orders}
                />}

                

                {view.order && <NewOrder
                    address={props.address}
                    scales={props.scales}
                    order={order}
                    drawerView={drawerView}
                />}

                {view.freeWeighing&&<Detail
                    curentScale={curentScale}
                    drawerView={drawerView}
                    measure={props.measure}
                    setMeasure={props.setMeasure}
                />}
                {view.orderDetails&&<OrderDetails
                    data={currentOrder}
                    drawerView={drawerView}
                />}

                {view.items&&<Groups />}
                <Typography paragraph>

                </Typography>
                {/* <TextF
                    title={'okokoko'}
                /> */}
            </main>
        </div>
    );
}