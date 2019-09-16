import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import excelLogo from '../img/excel_logo.svg';
import pdfLogo from '../img/Adobe_PDF_icon.svg';
import chartIcon from '../img/chart.svg';
import listIcon from '../img/Plan.svg'
import MaterialTable from 'material-table';
import DetailChart from './DetailChart';
// import { saveAs } from 'file-saver';
import XLSX from 'xlsx'
// import DevExpressTable from './DevExpressTable'

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





const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'end'
    },
    paper: {
        marginTop: theme.spacing(3),
        width: '100%',
        overflowX: 'auto',
        marginBottom: theme.spacing(2),
    },
    table: {
        // minWidth: 650,
    },
    imgContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginBottom: '20px'

    },
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

    img: {
        width: '24px',
        top: '8px',
        left: '-7px',
        position: 'relative',
    },

    head: {
        textAlign: 'left',
        marginLeft: '15px',
        paddingTop: '5px',
    },
    button: {
        marginLeft: '15px'
    }
}));





class OrderDetails extends Component {
    // classes = useStyles();
    // console.log('details:')

    state = {
        chart: false,
        rows: [],
        data: this.props.data ? this.props.data : [],
        details:{}
    }


    
    
    
    componentDidMount = () => {
        const orders = () => {fetch('http://localhost:5000/addDevice', {
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

        console.log(this.props.data)
        if (this.props.data.status === 'Zakończone') {
            orders()

        } else {
            const details = setInterval(() => {
                orders()
            }, 500)
            this.setState({details})

        }
        
        
    }

    componentWillUnmount = () => {
        clearInterval(this.state.details)
    }

    pageSizes = [5, 10, 15, 0];
    columns = [
        { title: 'Numer ważenia', name: 'measureNumber' },
        { title: 'Waga (g)', name: 'measure' },
        { title: 'Data', name: 'time', type: 'date' },
        { title: 'Max', name: 'max', type: 'numeric' },
        { title: 'Min', name: 'min', type: 'numeric' },
        { title: 'Próg LO', name: 'treshold', type: 'date' },
        { title: 'Ilość ważeń', name: 'quantity', type: 'numeric' },
    ];
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
            this.setState({rows:data})
        }
    }

    quantity = this.props.data.quantity

    toggleChart = () => {
        this.setState({ chart: !this.state.chart })
    }



    exportToXLS = () => {
        const workbook = XLSX.utils.book_new()
        const ws_name = "Arkusz1";
        const ws_data = [];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(workbook, ws, ws_name);
        const dataLength = this.state.rows.length
        let cellR = XLSX.utils.encode_cell({ c: 4, r: dataLength })
        const sheet = workbook.Sheets['Arkusz1']
        sheet['!ref'] = `A1:${cellR}`
        sheet[XLSX.utils.encode_cell({ c: 0, r: 0 })] = { v: 'Numer' }
        console.log(sheet['!cols'])
        var wscols = [
            { wch: 6 },
            { wch: 7 },
            { wch: 25 },

        ];

        sheet['!cols'] = wscols;
        for (let i = 0; i < dataLength; i++) {
            let cellA = XLSX.utils.encode_cell({ c: 0, r: i + 1 })
            sheet[cellA] = { v: this.state.rows[i]['measureNumber'] }
            let cellB = XLSX.utils.encode_cell({ c: 1, r: i + 1 })
            sheet[cellB] = { v: this.state.rows[i]['measure'] }
            let cellC = XLSX.utils.encode_cell({ c: 2, r: i + 1 })
            sheet[cellC] = { v: this.state.rows[i]['time'] }

        }
        const fileName = this.props.data.name + '.xlsx'
        console.log(workbook)
        XLSX.writeFile(workbook, fileName);

        // saveAs(new Blob([wbout],{type:"application/octet-stream"}), "test.xlsx")
        // var blob = new Blob([wbout], {type:"application/octet-stream"});
        // saveAs(blob, "test.xlsx");

    }

    render() {
        return (
            
            <div className="root">
                <div className="imgContainer">
                    <Button style={{marginLeft:'15px'}} variant="outlined" color="primary" onClick={() => { this.props.drawerView('ordersList')}}>
                        POWRÓT
                    </Button>
                    <div onClick={this.exportToXLS} className="imgDiv">
                        <img className="img" src={excelLogo} />
                    </div>
                    <div className="imgDiv" >
                        <img  className="img" src={pdfLogo} width="24px"/>
                    </div>
                    <div className="imgDiv" onClick={this.toggleChart} >
                        <img className="img" src={!this.state.chart ? chartIcon : listIcon} />
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
                {!this.state.chart && <Paper>
                    <div >
                        <h2></h2>
                        <p>Waga całkowita:  (g)</p>
                        <p>Ilość ważeń: </p>
                    </div>
                    <Grid
                        rows={this.state.rows}
                        columns={this.columns}
                        
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
                        <Table />
                        <TableHeaderRow />
                        {/* <TableRowDetail
                            contentComponent={RowDetail}
                        /> */}
                        <TableGroupRow />
                        <Toolbar />
                        <GroupingPanel
                            messages={{
                                groupByColumn: 'Przeciągnij kolumnę tutaj aby pogrupować'
                            }}

                        />
                        <PagingPanel
                            pageSizes={this.pageSizes}
                            messages={{
                                rowsPerPage: 'Wierszy na stronę',
                                showAll: 'Wszystkie',

                            }}
                        />
                    </Grid>
                </Paper>}



            </div>
        );
    }
}

export default OrderDetails
