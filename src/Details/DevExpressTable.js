import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Paging,
    SearchPanel,
    Pager,
    HeaderFilter
} from 'devextreme-react/data-grid';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CalendarPicker from './CalendarPicker'





class DevexpressTable extends Component {

    state = {
        row: {},
        open: false,
        selectedDateEnd: new Date(Date.now() + 86400000 * 1),
        selectedDateStart: new Date(Date.now() - (86400000 * 30)),
        rangeValue: 'Miesiąc',
        rows: [],
        pageSizes: [5, 10, 15, 0],
        columns: this.props.columns,
        totalSummaryItems: { columnName: 'measure', type: 'sum' },
        tableColumnExtensions: { columnName: 'measure', align: 'right' },
        user: this.props.user
    }

    componentDidMount = () => {
        this.orders()
        this.setDate()
    }

    componentDidUpdate = () => {
        // this.setDate()
    }



    orders = (start, end) => {

        if (!start || !end) {
            start = new Date(this.setDate() - (86400000 * 30))
            end = new Date((this.setDate() + (86400000 * 1)))

        }

        console.log(this.props)
        // this.props.socket.send(JSON.stringify({command:"GET_DATA", table:'orders'}))
        // this.props.socket.onmessage = (e) => {
        //     let data = e.data;
        //     const response = JSON.parse(data);
        //     console.log('orders: ', response)

        // }

        fetch(`http://${this.props.host}:5000/order`, {
            // fetch(`http://localhost:5000/order`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'fromtime': `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
                'totime': `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
            },
        })
            .then(data => data.json())
            .then(yourOrders => {
                console.log(yourOrders)
                // if (yourOrders.lenght > 0) {
                for (let order of yourOrders) {
                    // console.log(order.status)
                    switch (order.status) {
                        case 'InProgress':
                            order.status = this.props.lang.inProgress
                            break
                        case 'Finished':
                            order.status = this.props.lang.done
                            break
                        case 'InQueue':
                            order.status = this.props.lang.inQueue
                            break
                        case 'Error':
                            order.status = this.props.lang.error
                            break
                        case 'NotStarted':
                            order.status = this.props.lang.notStarted
                            break
                        case 'Interrupted':
                            order.status = this.props.lang.interrupted
                            break
                        default:
                            order.status = this.props.lang.notStarted
                    }
                }

                // }
                if (Array.isArray(yourOrders)) {
                    let rows
                    if (this.state.user.userName !== 'admin') {
                        rows = yourOrders.filter(order => {
                            return order.operator === this.state.user.userName
                        })

                    } else {
                        rows = yourOrders
                    }

                    this.setState({ rows })
                } else {
                    this.setState({ rows: yourOrders ? yourOrders.measurments : [] })
                }



            })
    }




    handleClickOpen = (row) => {
        this.setState({ row })
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    handleDateChange = (date, name) => {

        if (name === 'from') {
            this.setState({ selectedDateStart: date })

        } else {
            this.setState({ selectedDateEnd: date })
        }
        this.setDate()
        setTimeout(() => {
            this.orders('Dowolny')

        }, 300)
    }


    setDate = (array) => {
        if (array) {
            return new Date(`${array[2]}-${array[1]}-${array[0]}`)

        } else {
            const today = new Date()
            return Date.parse(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
        }
    }


    // TODO fetch all data row from DB every time when a component is called
    generateRows = () => {
        if (Array.isArray(this.props.data)) {
            return this.props.data

        } else {
            return this.props.data ? this.props.data.measurments : []

        }
    }

    deleteOrder = (row) => {
        fetch(`http://${this.props.host}:5000/order`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'guid': row.guid,

            },
        })
            .then(data => data.json())
            .then(order => {
                console.log(order)
                this.orders()
                this.setState({ open: false })
            })
            .catch(err => console.log(err))
    }
    RowDetail = ({ row }) => (
        <div className="imgContainer1">
            <div className="imgDiv" onClick={() => this.props.viewOrder(row)}>
                <EditIcon className="img2" onClick={() => this.props.viewOrder(row)} />
            </div>
            <div className="imgDiv" onClick={() => this.props.orderDetails(row)}>
                <InfoIcon className="img2" onClick={() => this.props.orderDetails(row)}></InfoIcon>
            </div>
            <div className="imgDiv">
                <DeleteIcon className="img2" onClick={() => this.handleClickOpen(row)} />
            </div>
        </div>

    );

    render() {
        return (
            <Paper>
                <div className="rangeContainer">

                    <CalendarPicker
                        cb={this.orders}
                        lang={this.props.lang}
                    />

                </div>

                <React.Fragment>
                    <DataGrid
                        dataSource={this.state.rows}
                        selection={{ mode: 'single' }}
                        showBorders={false}
                        hoverStateEnabled={true}
                        keyExpr={'guid'}
                        style={{
                            padding: 20
                        }}
                        onRowDblClick={(e) => this.props.orderDetails(e.data)}
                    >
                        <GroupPanel visible={true} emptyPanelText={
                            this.props.lang.dragColumn
                        } />
                        <Grouping autoExpandAll={false} />
                        <SearchPanel visible={true} placeholder={this.props.lang.search} />
                        <HeaderFilter visible={true} />
                        <Paging defaultPageSize={15} />
                        <Pager
                            showPageSizeSelector={true}
                            allowedPageSizes={[10, 15, 20]}
                            showInfo={true}
                            infoText={`${this.props.lang.page} {0} ${this.props.lang.of}  {1}`}
                        />
                        <Column dataField={'name'} caption={this.props.lang.orderName} />
                        <Column dataField={'operator'} caption={this.props.lang.operator} />
                        <Column dataField={'scaleName'} caption={this.props.lang.scaleName} width={150} />
                        <Column dataField={'base'} caption={this.props.lang.base} alignment={'center'} />
                        <Column dataField={'quantity'} caption={this.props.lang.quantity} dataType={'numeric'} alignment={'center'} />
                        <Column dataField={'time'} caption={this.props.lang.date} dataType={'date'} format={"yyyy/MM/dd"} width={100} />
                        <Column dataField={'status'} caption={this.props.lang.status} width={100} />

                    </DataGrid>

                </React.Fragment>
            </Paper>
        );
    }

};

export default DevexpressTable;

