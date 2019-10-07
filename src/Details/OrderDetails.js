import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import excelLogo from '../img/excel_logo.svg';
import pdfLogo from '../img/Adobe_PDF_icon.svg';
import chartIcon from '../img/chart.svg';
import listIcon from '../img/Plan.svg'
import DetailChart from './DetailChart';
import CreatePdf from '../helpers/CreatePDF';
import CreateXLSX from '../helpers/ExportToXLS';

import {
    PagingState,
    GroupingState,
    IntegratedSummary,
    IntegratedGrouping,
    IntegratedPaging,
    SummaryState,
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
} from '@devexpress/dx-react-grid-material-ui';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';



class OrderDetails extends Component {

    state = {
        chart: false,
        rows: [],
        data: this.props.data ? this.props.data : [],
        details: {},
        open: false
    }





    componentDidMount = () => {
        const orders = () => {
            fetch('http://localhost:5000/addDevice', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'orderguid': this.props.data.guid,

                }
            })
                .then(data => data.json())
                .then(measurments => {
                    // data.measurments = measurments; 
                    this.setState({ rows: measurments })
                    console.log(measurments)
                })
                .catch(err => console.log(err))
        }

        if (this.props.data.status === 'Zakończone' || !this.props.data.guid || this.state.chart) {
            orders()

        } else {
            const details = setInterval(() => {
                orders()
            }, 500)
            this.setState({ details })

        }


    }
    componentDidUpdate = () => {
        if (this.state.chart) {
            clearInterval(this.state.details)
        }
    }
    componentWillUnmount = () => {
        clearInterval(this.state.details)
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        // setOpen(false);
        this.setState({ open: false })
    }

    pageSizes = [10, 20, 50];
    columns = [
        { title: this.props.lang.measureNumber, name: 'measureNumber', width: 10 },
        { title: this.props.lang.measure, name: 'measure' },
        { title: this.props.lang.date, name: 'time', type: 'date' },
        { title: this.props.lang.item, name: 'item' },
        { title: this.props.lang.operator, name: 'operator' },
        { title: this.props.lang.orderName, name: 'name' },
        // { title: 'Ilość ważeń', name: 'quantity', type: 'numeric' },
    ];
    tableColumnExtensions = [
        { columnName: 'measureNumber', align: 'center' }
    ]
    totalSummaryItems = [
        { columnName: 'measure', type: 'sum' },
    ];
    tableColumnExtensions = [
        { columnName: 'measure', align: 'right' },
    ];
    generateRows = () => {

        if (Array.isArray(this.props.data)) {

            return this.props.data
        } else {
            console.log(this.props.data)
            const data = this.props.data ? this.props.data.measurments : []
            console.log(data)
            // for (let x of data) {

            // }
            this.setState({ rows: data })
        }
    }

    quantity = this.props.data.quantity

    toggleChart = () => {
        this.setState({ chart: !this.state.chart })
    }

    orderDetails = (data) => {

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


                this.props.drawerView('orderDetails')
            })
            .catch(err => console.log(err))
    }

    deleteOrder = (data) => {

        fetch('http://localhost:5000/order', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'guid': data.guid,

            },
        })
            .then(data => data.json())
            .then(order => {
                console.log(order)
                // clearInterval(this.state.details)
                this.props.drawerView('ordersList')
                this.setState({ open: false })
            })
            .catch(err => console.log(err))
    }


    render() {
        return (

            <div className="root">
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.lang.deleting}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.props.lang.deleteConfirm} <b>{this.state.data.name}?</b>:
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.deleteOrder(this.state.data)} color="primary">
                            {this.props.lang.delete}
                        </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            {this.props.lang.back}
                        </Button>
                    </DialogActions>
                </Dialog>
                <div className="imgContainer">
                    <Button style={{ marginLeft: '15px' }} variant="outlined" color="primary" onClick={() => { this.props.drawerView('ordersList') }}>
                        {this.props.lang.back}
                    </Button>
                    <Button style={{ marginLeft: '15px' }} variant="outlined" color="primary" onClick={() => { this.props.viewOrder(this.state.data) }}>
                        {this.props.lang.details}
                    </Button>
                    <Button style={{ marginLeft: '15px' }} variant="outlined" color="secondary" onClick={() => { this.handleClickOpen() }}>
                        {this.props.lang.delete}
                    </Button>
                    <div onClick={() => CreateXLSX({ rows: this.state.rows, name: this.state.data.name })} className="imgDiv">
                        <img className="img" alt="export-to-xlsx" src={excelLogo} />
                    </div>
                    <div onClick={() => CreatePdf({ measurments: this.state.rows, name: this.state.data.name })} className="imgDiv" >
                        <img className="img" alt="export-to-pdf" src={pdfLogo} width="24px" />
                    </div>
                    <div className="imgDiv" onClick={this.toggleChart} >
                        <img className="img" alt="chart-toggle-icon" src={!this.state.chart ? chartIcon : listIcon} />
                    </div>
                </div>



                {this.state.chart && <DetailChart
                    data={this.state.data}
                    rows={this.state.rows}
                />}

                {/* {!chart && <DevExpressTable
                    data={props.data}
                    columns={columns}
                />} */}
                {!this.state.chart && <Paper >
                    <div style={{ margin: 20, textAlign: 'left', position: 'relative', left: '60px', top: '15px' }}>
                        <h2>{this.props.lang.order}:  {this.props.data.name}</h2>
                        <span style={{ marginRight: '10px' }}><b>{this.props.lang.operator}:</b> {this.props.data.operator}</span>
                        <span style={{ marginRight: '10px' }}><b>{this.props.lang.quantity}:</b> {this.props.data.quantity}</span>
                        <span style={{ marginRight: '10px' }}><b>Typ:</b> {this.props.data.type}</span>
                        <span style={{ marginRight: '10px' }}><b>{this.props.lang.scaleName}:</b> {this.props.data.scaleName}</span>
                        <span style={{ marginRight: '10px' }}><b>{this.props.lang.item}:</b> {this.props.data.item}</span>

                    </div>
                    <div className="hr" style={{ width: '90%' }} />
                    <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>


                        <Grid
                            rows={this.state.rows}
                            columns={this.columns}

                        // margin-left: auto;
                        // margin-right: auto;

                        // rowUpdated={setRows(generateRows)}
                        >
                            <PagingState
                                defaultCurrentPage={0}
                                defaultPageSize={10}
                            />
                            {/* <RowDetailState
                        // defaultExpandedRowIds={[2, 5]}
                        /> */}

                            <IntegratedPaging />
                            <DragDropProvider />
                            <GroupingState />
                            {/* <GroupingState defaultGrouping={[{ columnName: 'city' }]} /> */}

                            <IntegratedGrouping />
                            <SummaryState
                            // totalItems={totalSummaryItems}
                            />
                            <IntegratedSummary />
                            {/* <TableSummaryRow /> */}
                            <Table
                                columnExtensions={[
                                    { columnName: 'measureNumber', align: 'center', width: 100 },
                                    { columnName: 'measure', align: 'center', width: 100 }
                                ]} />
                            <TableHeaderRow />
                            {/* <TableRowDetail
                            contentComponent={RowDetail}
                        /> */}
                            <TableGroupRow />
                            <Toolbar />
                            <GroupingPanel
                                messages={{
                                    groupByColumn: this.props.lang.dragColumn
                                }}

                            />
                            <PagingPanel
                                pageSizes={this.pageSizes}
                                messages={{
                                    rowsPerPage: this.props.lang.rowsOnPage,
                                    showAll: 'Wszystkie',

                                }}
                            />
                        </Grid>
                    </div>
                </Paper>}



            </div>
        );
    }
}

export default OrderDetails
