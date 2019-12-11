import React from 'react';
import Paper from '@material-ui/core/Paper';
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Paging,
    SearchPanel,
    Pager,
    HeaderFilter,
    LoadPanel
} from 'devextreme-react/data-grid';
import Button from '@material-ui/core/Button';
import CalendarPicker from './CalendarPicker';
import excelLogo from '../img/excel_logo.svg';
import pdfLogo from '../img/Adobe_PDF_icon.svg';
import refreshIcon from '../img/Refresh_icon.svg';
import CreatePdf from '../helpers/CreatePDF';
import CreateXLSX from '../helpers/ExportToXLS';


class AllMeasurments extends React.Component {
    constructor(props) {
        super(props);

        this.dataGrid = React.createRef();

        this.getRows = (type) => {
            this.rows.selectAll()
                .then((data) => {
                    // const x = this.rows.getSelectedRowsData()
                    let payload = {}
                    switch (type) {
                        case 'pdf':
                            payload.measurments = data
                           CreatePdf(payload)
                            break
                        case 'xlsx':
                            payload.rows = data
                            CreateXLSX(payload)
                            break
                        default:
                            console.log('Nie ma takiego typu')

                    }

                })
            this.rows.deselectAll()
        };
    }

    get rows() {
        // console.log(this.dataGrid.current.instance)
        return this.dataGrid.current.instance;
    }
    state = {
        rows: []
    }


    getRowId = row => row.id;

    componentDidMount = () => {
        this.allMeasurments()
    }

    allMeasurments = (start, end) => {
        if (!start || !end) {
            const today = new Date()
            // console.log('xxx',new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}` +86400000))
            const newDate = Date.parse(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
            start = new Date(newDate - (86400000 * 30))
            end = new Date((newDate + (86400000 * 1)))
        }
        fetch(`http://${this.props.host}:5000/addMeasurement`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'fromtime': `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
                'totime': `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`

            }
        })
            .then(data => data.json())
            .then(measurments => {
                console.log(measurments)
                this.generateRows()
                let test 
                    if (this.props.user.userName !== 'admin') {
                        test = measurments.filter(order => {
                            return order.operator === this.props.user.userName
                        })

                    } else {
                        test = measurments
                    }
        
                this.setState({ rows: test })
            })
            .catch(err => console.log(err))
    }



    generateRows = (rows) => {
        let count = 0
        if (rows && rows.length > 0) {
            rows.map(row => {
                row.id = count++;

                // row.initials = row.firstName[0].toUpperCase() + row.lastName[0].toUpperCase()
            })

            this.setState({ rows })
        } else {
            this.setState({ rows: [] })
        }
        // console.log(rows)

    }


    render() {
        return (
            <div className="root"> 
                <div className="imgContainer">
                    <Button style={{ marginLeft: '15px' }} variant="outlined" color="primary" onClick={() => { this.props.drawerView('scales') }}>
                        {this.props.lang.back}
                    </Button>
                    {/* <Button style={{ marginLeft: '15px' }} variant="outlined" color="primary" onClick={() => { this.allMeasurments() }}>
                        Ref
                    </Button> */}
                    <div onClick={ this.allMeasurments} className="imgDiv" >
                        <img className="img" alt="refresh_icon"src={refreshIcon} width="24px" />
                    </div>
                    <div onClick={() => this.getRows('pdf')} className="imgDiv" >
                        <img className="img" alt="pdf_icon" src={pdfLogo} width="24px" />
                    </div>
                    <div  onClick={() => this.getRows('xlsx')} className="imgDiv">
                        <img className="img" alt="xlsx_icon" src={excelLogo} />
                    </div>

                </div>
                {/* <Paper style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}> */}
                <Paper>
                    <CalendarPicker
                        cb={this.allMeasurments}
                        lang={this.props.lang}
                    />
                    <DataGrid

                        dataSource={this.state.rows}
                        selection={{ mode: 'single' }}


                        showBorders={false}
                        // onContentReady={onContentReady}
                        // remoteOperations={true}
                        hoverStateEnabled={true}
                        // wordWrapEnabled={true}
                        style={{
                            padding: 20

                        }}
                        ref={this.dataGrid}
                    // marginLeft='auto'
                    // marginRight='auto'
                    // onSelectionChanged={this.onSelectionChanged}
                    // onRowDblClick={(e) => this.props.orderDetails(e.data)}
                    >
                        <GroupPanel visible={true} 
                            emptyPanelText={
                                this.props.lang.dragColumn
                            }
                        />
                        <Grouping autoExpandAll={false} />
                        {/* <Scrolling mode={'virtual'} /> */}
                        <SearchPanel visible={false} />
                        <Paging defaultPageSize={15} />
                        <HeaderFilter visible={true} />
                        {/* <Sorting mode={'none'} /> */}
                        {/* <Scrolling mode={'infinite'}  /> */}
                        <LoadPanel enabled={true} />
                        <Pager
                            showPageSizeSelector={true}
                            allowedPageSizes={[10, 15, 20]}
                            showInfo={true}
                            infoText={`${this.props.lang.page} {0} ${this.props.lang.of}  {1}`}
                        />
                        <Column dataField={'measureNumber'} caption={this.props.lang.measureNumber} width={70} />
                        <Column dataField={'measure'} caption={this.props.lang.measure} />
                        <Column dataField={'item'} caption={this.props.lang.item} />
                        <Column dataField={'time'} dataType={'date'} caption={this.props.lang.date} format={"yyyy/MM/dd"} />
                        {/* <Column dataField={'time'} dataType={'date'} format={"yyyy/MM/dd"} width={100}/> */}
                        <Column dataField={'operator'} caption={this.props.lang.operator}/>
                        {/* <Column dataField={'name'} caption={this.props.lang.orderName} /> */}
                        <Column dataField={'scaleName'} caption={this.props.lang.scaleName} />

                    </DataGrid>
                </Paper>
            </div>
        )
    }
}

export default AllMeasurments;
