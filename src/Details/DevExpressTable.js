import React, { useState, useEffect, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
    PagingState,
    GroupingState,
    IntegratedSummary,
    IntegratedGrouping,
    IntegratedPaging,
    SummaryState,
    DataTypeProvider,
    RowDetailState
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableGroupRow,
    GroupingPanel,
    DragDropProvider,
    Toolbar,
    PagingPanel,
    TableSummaryRow,
    TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';
// import infoIcon from '../img/paramInfo.svg'
import InfoIcon from '@material-ui/icons/Info';
// import deleteIcon from '../img/delete.svg'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Grid1 from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';



const dateRange = [
    { key: 0, name: 'Dzień' },
    { key: 1, name: 'Tydzień' },
    { key: 2, name: 'Miesiąc' },
    { key: 3, name: 'Dowolny' }

]

// import { generateRows } from '../../../demo-data/generator';

const useStyles = makeStyles(theme => ({
    imgDiv: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        transition: '0.5s',
        '&:hover': {
            backgroundColor: '#282c3425',
            cursor: 'pointer'
        }
    },
    img1: {
        width: 40,
        top: 1,
        // height:'24px',
        position: 'relative',
    },
    img2: {
        position: 'relative',
        width: 32,
        top: 7,
        left: 4
    },

    imgContainer: {
        display: 'flex',
        // flexDirection: 'row-reverse',
        // marginBottom: '20px'

    },
    menu: {
        width: 250
    },
    dense: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: 19,
        width: 200
    },
}))


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
        tableColumnExtensions: { columnName: 'measure', align: 'right' }
    }

    componentDidMount = () => {
        this.orders()
        this.setDate()
    }

    componentDidUpdate = () => {
        // this.setDate()
    }



    orders = (rangeValue) => {
        let start, end

        switch (rangeValue) {
            case 'Dzień':
                this.setState({ selectedDateStart: new Date(this.setDate()) })
                this.setState({ selectedDateEnd: new Date((this.setDate() + (86400000 * 2))) })
                start = new Date(this.setDate())
                end = new Date((this.setDate() + (86400000 * 1)))
                break
            case 'Tydzień':
                this.setState({ selectedDateStart: new Date(this.setDate() - (86400000 * 7)) })
                this.setState({ selectedDateEnd: new Date(this.setDate() + (86400000 * 1)) })
                start = new Date(this.setDate() - (86400000 * 7))
                end = new Date((this.setDate() + (86400000 * 1)))
                break
            case 'Miesiąc':
                this.setState({ selectedDateStart: new Date(this.setDate() - (86400000 * 30)) })
                this.setState({ selectedDateEnd: new Date(this.setDate() + (86400000 * 1)) })
                start = new Date(this.setDate() - (86400000 * 30))
                end = new Date((this.setDate() + (86400000 * 1)))
                break
            case 'Dowolny':
                start = this.state.selectedDateStart;
                end = this.state.selectedDateEnd
                break
            default:
                this.setState({ selectedDateStart: new Date(this.setDate() - (86400000 * 30)) })
                this.setState({ selectedDateEnd: new Date(this.setDate() + (86400000 * 1)) })
                start = new Date(this.setDate() - (86400000 * 30))
                end = new Date((this.setDate() + (86400000 * 1)))
        }

        console.log('start: ', `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`)
        console.log('end: ', `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`)
        // console.log(numberDays, rangeValue)
        // const date = new Date(now - 86400000 * numberDays)
        // console.log(`${this.state.selectedDateStart.getFullYear()}-${this.state.selectedDateStart.getMonth()+1}-${this.state.selectedDateStart.getDate()}`)
        // console.log(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)
        // console.log(`${this.state.selectedDateEnd.getFullYear()}-${this.state.selectedDateEnd.getMonth()+1}-${this.state.selectedDateEnd.getDate()}`)

        fetch('http://localhost:5000/order', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'fromtime': `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
                'totime': `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
            },
        })
            .then(data => data.json())
            .then(yourOrders => {
                if (yourOrders.length > 0) {
                    for (let order of yourOrders) {
                        switch (order.status) {
                            case 0:
                                order.status = 'Trwa'
                                break
                            case 1:
                                order.status = 'Zakończone'
                                break
                            case 2:
                                order.status = 'Przerwane'
                                break
                            default:
                                order.status = 'Nieznany'
                        }
                    }

                }
                if (Array.isArray(yourOrders)) {
                    console.log(yourOrders)
                    // setRows(yourOrders)
                    this.setState({ rows: yourOrders })
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
        // setOpen(false);
        this.setState({ open: false })
    }

    handleDateChange = (date, name) => {
        console.log(date)
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

    // const classes = useStyles();

    // const [rows] = useState([{ city: 'test' }]);
    setDate = (array) => {
        // return new Promise((res, rej) => {
        // let date
        if (array) {
            return new Date(`${array[2]}-${array[1]}-${array[0]}`)

        } else {
            const today = new Date()
            // console.log('xxx',new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}` +86400000))
            return Date.parse(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)


        }
        // console.log(date)
        // if (this.state.rangeValue === 'Dzień') {
        //     this.setState({ selectedDateStart: new Date(date) })
        //     this.setState({ selectedDateEnd: new Date(date + (86400000 * 1)) })
        // } else if (this.state.rangeValue === 'Tydzień') {
        //     this.setState({ selectedDateStart: new Date(date) })
        //     this.setState({ selectedDateEnd: new Date(date + (86400000 * 7)) })
        // }
        // switch (this.state.rangeValue) {
        //     case 'Dzień':
        //         this.setState({ selectedDateStart: new Date(date) })
        //         this.setState({ selectedDateEnd: new Date(date + (86400000 * 1)) })
        //         break
        //     case 'Tydzień':
        //         this.setState({ selectedDateStart: new Date(date - (86400000 * 7)) })
        //         this.setState({ selectedDateEnd: new Date(date + (86400000 * 1)) })

        //         break
        //     case 'Miesiąc':
        //         this.setState({ selectedDateStart: new Date(date - (86400000 * 30)) })
        //         this.setState({ selectedDateEnd: new Date(date + (86400000 * 1)) })

        //         break
        //     case 'Dowolny':

        //         break
        //     default:
        //         this.setState({ selectedDateStart: new Date(date - (86400000 * 30)) })
        //         this.setState({ selectedDateEnd: new Date(date + (86400000 * 1)) })

        // }

        // })


    }


    // TODO fetch all data row from DB every time when a component is called
    generateRows = () => {
        if (Array.isArray(this.props.data)) {
            return this.props.data

        } else {
            return this.props.data ? this.props.data.measurments : []

        }
    }

    refresh = () => {
        const test = this.state.row
        console.log(test)
        let x = this.props.orderDetails(test)
        // setInterval(() => {
        //     console.log(x)
        // }, 1000)
    }

    deleteOrder = (row) => {
        console.log(row)
        fetch('http://localhost:5000/order', {
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

    // const tttt = orders()
    // console.log(tttt)
    render() {
        return (
            <Paper>
                {/* <div >
                    <h2></h2>
                    <p>Waga całkowita:  (g)</p>
                    <p>Ilość ważeń: </p>
                </div> */}
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Usuwanie zlecenia"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Chcesz usunuąć zlecenie <b>{this.state.row.name}</b>:
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.deleteOrder(this.state.row)} color="primary">
                            Usuń
                        </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Powrót
                        </Button>
                    </DialogActions>
                </Dialog>
                <div className="rangeContainer">
                    <div >
                        <TextField
                            id="date_range"
                            select
                            label="Zakres zleceń"
                            style={{
                                width:200,
                                marginTop:19

                            }}
                            value={this.state.rangeValue}
                            onChange={(e) => {
                                this.setState({ rangeValue: e.target.value });
                                this.orders(e.target.value)
                            }}
                            // SelectProps={{
                            //     MenuProps: {
                            //         className: classes.menu,
                            //     },
                            // }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            // helperText="Wybierz operatora"
                            margin="dense"
                        // variant="outlined"
                        >
                            {dateRange.map(range => (
                                <MenuItem key={range.key} value={range.name} >
                                    {range.name}
                                </MenuItem>
                            ))}

                        </TextField>
                    </div>
                    {this.state.rangeValue === 'Dowolny' && <div className="datePickerContainer">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid1 container justify="space-around">
                                <KeyboardDatePicker
                                    disableToolbar
                                    // variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="from-date"
                                    label="Od"
                                    style={{

                                        marginLeft:10
                                    }}
                                    value={this.state.selectedDateStart}
                                    onChange={(e) => this.handleDateChange(e, 'from')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid1>
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid1 container justify="space-around">
                                <KeyboardDatePicker
                                    disableToolbar
                                    // variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="to-date"
                                    label="Do"
                                    style={{

                                        marginLeft:10
                                    }}
                                    value={this.state.selectedDateEnd}
                                    onChange={(e) => this.handleDateChange(e, 'to')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid1>
                        </MuiPickersUtilsProvider>

                    </div>}
                </div>

                <Grid
                    rows={this.state.rows}
                    columns={this.state.columns}
                >
                    <PagingState
                        defaultCurrentPage={0}
                        defaultPageSize={10}
                    />
                    {this.props.orderDetails && <RowDetailState
                    // defaultExpandedRowIds={[2, 5]}
                    />}

                    <IntegratedPaging />
                    <DragDropProvider />
                    <GroupingState />
                    {/* <GroupingState defaultGrouping={[{ columnName: 'city' }]} /> */}

                    <IntegratedGrouping />
                    <SummaryState
                        totalItems={this.state.totalSummaryItems}
                    />
                    <IntegratedSummary />
                    {/* <TableSummaryRow /> */}
                    <Table />
                    <TableHeaderRow />
                    <TableRowDetail
                        contentComponent={this.RowDetail}
                    />
                    <TableGroupRow />
                    <Toolbar />
                    <GroupingPanel
                        messages={{
                            groupByColumn: 'Przeciągnij kolumnę tutaj aby pogrupować'
                        }}

                    />
                    <PagingPanel
                        pageSizes={this.state.pageSizes}
                        messages={{
                            rowsPerPage: 'Wierszy na stronę',
                            showAll: 'Wszystkie',
                        }}
                    />
                </Grid>
            </Paper>
        );
    }

};

export default DevexpressTable;

