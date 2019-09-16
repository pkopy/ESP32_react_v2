import React, { useState, useEffect } from 'react';
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
    {key: 0, name: 'Dzień'},
    {key: 1, name: 'Tydzień'},
    {key: 2, name: 'Miesiąc'},
    {key: 3, name: 'Dowolny'}

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
    menu:{
        width:250
    },
    dense: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: 19,
        width: 200
    },
}))


export default (props) => {
    console.log(props)
    
    const [rangeValue, setRangeValue] = React.useState('')
    useEffect(() => {
        
    })
    
    const orders = (rangeValue) => {
        const now = Date.now() 
        let numberDays
        switch (rangeValue) {
            case 'Dzień':
                numberDays = 1
                break
            case 'Tydzień':
                numberDays = 7
                break
            case 'Miesiąc':
                numberDays = 30
                break
            default:
                numberDays= -1
            
        }
        console.log(numberDays, rangeValue)
        const date = new Date(now-86400000 * numberDays)
        console.log(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)
        fetch('http://localhost:5000/order',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'fromtime': `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}` ,
                'totime':''
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
                    setRows(yourOrders)
                } else {
                   setRows(yourOrders ? yourOrders.measurments : [])
                }
                
            })
    }

    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const [open, setOpen] = React.useState(false);
    const [row, setRow] = React.useState({})

    
    function handleClickOpen(row) {
        setRow(row)
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleDateChange(date) {
        console.log(date)
        setSelectedDate(date);
    }
    const classes = useStyles();
    const [pageSizes] = useState([5, 10, 15, 0]);
    const [columns] = useState(props.columns);
    // const [rows] = useState([{ city: 'test' }]);
    const [totalSummaryItems] = useState([
        { columnName: 'measure', type: 'sum' },
    ]);
    const [tableColumnExtensions] = useState([
        { columnName: 'measure', align: 'right' },
    ]);


    // TODO fetch all data row from DB every time when a component is called
    const generateRows = () => {
        if (Array.isArray(props.data)) {
            return props.data

        } else {
            return props.data ? props.data.measurments : []

        }
    }

    const refresh = () => {
        const test = row
        console.log(test)
        let x = props.orderDetails(test)
        // setInterval(() => {
        //     console.log(x)
        // }, 1000)
    }

    const deleteOrder = (row) => {
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
                orders()
                setOpen(false)
                // props.setCurrentOrder(data); props.drawerView('orderDetails')
            })
            .catch(err => console.log(err))
    }
    const RowDetail = ({ row }) => (
        <div className={classes.imgContainer}>
            <div className={classes.imgDiv} onClick={() => props.viewOrder(row)}>
                {/* <img className={classes.img1} src={infoIcon} /> */}
                <EditIcon onClick={() => props.viewOrder(row)} className={classes.img2} />
            </div>
            <div className={classes.imgDiv} onClick={() => props.orderDetails(row)}>
                {/* <img className={classes.img1} src={infoIcon} /> */}
                <InfoIcon className={classes.img2} onClick={() => props.orderDetails(row)}></InfoIcon>
            </div>
            <div className={classes.imgDiv}  >
                {/* <img className={classes.img2}  src={deleteIcon} onClick={() => props.confirmDeleteOrder()}/> */}
                {/* <img className={classes.img2} src={DeleteIcon} onClick={() => handleClickOpen(row)} /> */}
                <DeleteIcon className={classes.img2} onClick={() => handleClickOpen(row)} />
            </div>
        </div>

    );
    const [rows, setRows] = useState(props.data)
    // const tttt = orders()
    // console.log(tttt)
    return (
        <Paper>
            {/* <div >
                <h2></h2>
                <p>Waga całkowita:  (g)</p>
                <p>Ilość ważeń: </p>
            </div> */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Usuwanie zlecenia"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Chcesz usunuąć zlecenie <b>{row.name}</b>:
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => deleteOrder(row)} color="primary">
                        Usuń
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Powrót
                    </Button>
                </DialogActions>
            </Dialog>
            <TextField
                id="date_range"
                select
                label="Zakres zleceń"
                className={classes.dense}
                value={rangeValue}
                onChange={(e) => {setRangeValue(e.target.value);orders(e.target.value)}}
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
            {rangeValue==='Dowolny'&&<MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid1 container justify="space-around">
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </Grid1>
            </MuiPickersUtilsProvider>}
            <Grid
                rows={rows}
                columns={columns}
            >
                <PagingState
                    defaultCurrentPage={0}
                    defaultPageSize={10}
                />
                {props.orderDetails && <RowDetailState
                // defaultExpandedRowIds={[2, 5]}
                />}

                <IntegratedPaging />
                <DragDropProvider />
                <GroupingState />
                {/* <GroupingState defaultGrouping={[{ columnName: 'city' }]} /> */}

                <IntegratedGrouping />
                <SummaryState
                    totalItems={totalSummaryItems}
                />
                <IntegratedSummary />
                {/* <TableSummaryRow /> */}
                <Table />
                <TableHeaderRow />
                <TableRowDetail
                    contentComponent={RowDetail}
                />
                <TableGroupRow />
                <Toolbar />
                <GroupingPanel
                    messages={{
                        groupByColumn: 'Przeciągnij kolumnę tutaj aby pogrupować'
                    }}

                />
                <PagingPanel
                    pageSizes={pageSizes}
                    messages={{
                        rowsPerPage: 'Wierszy na stronę',
                        showAll: 'Wszystkie',
                    }}
                />
            </Grid>
        </Paper>
    );
};
