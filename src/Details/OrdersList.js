import React from 'react';
import { makeStyles } from '@material-ui/styles';
import DevExpressTable from './DevExpressTable'
import Button from '@material-ui/core/Button';
import SocketLib from '../Socket'

const useStyles = makeStyles(theme => ({
    tab: {
        marginLeft: 'auto',
        marginRight: 'auto',
        // width: '80%'
    },
    root: {
        maxWidth: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'end'
    },
    paper: {
        // marginTop: theme.spacing(3),
        width: '100%',
        overflowX: 'auto',
        // marginBottom: theme.spacing(2),
    },
}))

export default function MaterialTableDemo(props) {
    

    const columns = [
        { title: 'Twoja nazwa', name: 'name' },
        { title: 'Operator', name: 'operator' },
        { title: 'Podstawa', name: 'base', type: 'numeric' },
        { title: 'Waga', name: 'scaleName' },
        { title: 'Ilość ważeń', name: 'quantity', type: 'numeric' },
        { title: 'Data zlecenia', name: 'time', type: 'date' },
        { title: 'Status', name: 'status' }
    ]

    const orderDetails = (data) => {

        fetch('http://localhost:5000/addDevice', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'orderguid': data.guid,

            },
        })
            .then(data => data.json())
            .then(measurments => {
                data.measurments = measurments;

                // if (SocketLib.connection) {
                //     SocketLib.connection.close()
                // }
                // console.log(data)
                props.setCurrentOrder(data); props.drawerView('orderDetails')
            })
            .catch(err => console.log(err))
    }


    return (
        <div className="root">
            <div className="imgContainer">
                <Button style={{ marginLeft: '15px' }} variant="outlined" color="primary" onClick={() => { props.drawerView('scales') }}>
                    {props.lang.back}
                </Button>
                <Button style={{ marginLeft: '15px' }} variant="outlined" color="primary" onClick={() => { props.drawerView('order') }}>
                    {props.lang.newOrder}
                </Button>

            </div>
            <div >

                <DevExpressTable
                    data={props.yourOrders}
                    columns={columns}
                    viewOrder={props.viewOrder}
                    orderDetails={orderDetails}
                    orders={props.orders}
                    lang={props.lang}
                />


            </div>
        </div>

    );
}

