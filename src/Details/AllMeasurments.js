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
    LoadPanel,
    ColumnChooser,
    Export,
    FilterRow,
    StateStoring, Summary, TotalItem
} from 'devextreme-react/data-grid';
import { Template } from 'devextreme-react/core/template';
import { SortingState } from '@devexpress/dx-react-grid';
import Button from '@material-ui/core/Button';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import RefreshIcon from '@material-ui/icons/Refresh';
import CalendarPicker from './CalendarPicker';
import excelLogo from '../img/excel_logo.svg';
import pdfLogo from '../img/Adobe_PDF_icon.svg';
import refreshIcon from '../img/Refresh_icon.svg';
import CreatePdf from '../helpers/CreatePDF';
import CreateXLSX from '../helpers/ExportToXLS';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pue71 from '../img/pue71.png';
import './AllMeasurments.scss';
import { IconButton } from '@material-ui/core';


class AllMeasurments extends React.Component {
    constructor(props) {
        super(props);

        this.dataGrid = React.createRef();
        this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
        this.toolbarItemRender = this.toolbarItemRender.bind(this);
        this.getRows = (type) => {

            this.rows.selectAll()
                .then(data => {
                    let docDetails = {
                        content: [
                            {
                                image: 'data:image/jpeg;base64,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',
                                width: 100
                            },
                            {

                                table: {
                                    headerRows: 1,
                                    widths: ['*', '*', '*', '*', '*'],
                                    body:
                                        [
                                            ['Nazwa', 'Masa', 'Jednostka', 'Tara', 'Data'],


                                        ]
                                },
                                layout: 'noBorders'
                            },

                        ]
                    }
                    let count = 0;
                    for (let elem of data) {
                        if (count < 1000) {

                            docDetails.content[1].table.body.push([
                                { text: `${elem.scale_name}`, style: { fontSize: 8 }, fillColor: count % 2 === 0 ? '#ddd' : null },
                                { text: `${elem.mass}`, style: { fontSize: 8 }, fillColor: count % 2 === 0 ? '#ddd' : null },
                                { text: `${elem.unit}`, style: { color: 'blue', aligment: 'center', fontSize: 8 }, fillColor: count % 2 === 0 ? '#ddd' : null },
                                { text: `${elem.tare}`, style: { color: 'blue', aligment: 'center', fontSize: 8 }, fillColor: count % 2 === 0 ? '#ddd' : null },
                                { text: `${elem.time}`, style: { color: 'red', fontSize: 8 }, fillColor: count % 2 === 0 ? '#ddd' : null },
                            ])
                            count++
                        }

                    }
                    console.log(docDetails)
                    return docDetails

                })
                .then((data) => {
                    // const x = this.rows.getSelectedRowsData()
                    console.log(data)

                    // let payload = {}
                    // switch (type) {
                    //     case 'pdf':
                    // payload.measurments = data
                    //    CreatePdf(payload)
                    pdfMake.createPdf(data).open();


                    // pdfMake.createPdf(data).print();


                    //     break
                    // case 'xlsx':
                    //     payload.rows = data
                    //     CreateXLSX(payload)
                    //     break
                    // default:
                    //     console.log('Nie ma takiego typu')

                    // }

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


    toolbarItemRender() {
        return (
            <p></p>
        );
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift(
            {
                location: 'before',
                template: 'totalGroupCount'


            },
            // {
            //     location: 'after',
            //     widget: 'dxButton',
            //     options: {
            //         icon: 'refresh',
            //         hint: 'Refresh',
            //         onClick: this.allMeasurments.bind(this)
            //     }
            //
            // },
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    icon: 'save',
                    hint: 'PDF',
                    onClick: this.getRows.bind(this)
                }
            }
        );
    }

    getRowId = row => row.id;

    componentDidMount = () => {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        this.allMeasurments()
    }

    allMeasurments = (start, end) => {
        if (!start || !end) {
            const today = new Date()
            // console.log('xxx',new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}` +86400000))
            const newDate = Date.parse(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
            start = new Date(newDate - (86400000 * 2))
            end = new Date((newDate + (86400000 * 1)))
        }
        fetch(`http://${this.props.host}:5000/addMeasurement`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'fromtime': `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()} ${start.getHours()}:${start.getMinutes()}`,
                'totime': `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()} ${end.getHours()}:${end.getMinutes()}`,
                // 'orderbyfield':'internal_id'

            }
        })
            .then(data => data.json())
            .then(measurments => {
                console.log(measurments, "measurments")
                this.generateRows()
                let test
                console.log(this.props.user.user_name)
                if (this.props.user.user_name !== 'admin') {
                    test = measurments.filter(order => {
                        return order.operator === this.props.user.user_name
                    })

                } else {
                    test = measurments
                }
                console.log(test)
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
            <div className="root root-styles">
                <div className="imgContainer">
                    <div className="toLeft">
                        <CalendarPicker customClass={"test"}
                            cb={this.allMeasurments}
                            lang={this.props.lang}
                        />
                    </div>
                    <div className="toRight">

                        {/* <Button style={{ marginLeft: '15px' }} variant="outlined" color="primary" onClick={() => { this.allMeasurments() }}>
                            Ref
                        </Button> */}


                        {/*<div  onClick={() => this.getRows('xlsx')} className="imgDiv">*/}
                        {/*    <img alt="xlsx_icon" src={excelLogo} />*/}
                        {/*</div>*/}
                        {/*<div onClick={() => this.getRows('pdf')} className="imgDiv" >*/}
                        {/*    /!*<img  alt="pdf_icon" src={pdfLogo} />*!/*/}
                        {/*    <PictureAsPdfIcon />*/}
                        {/*</div>*/}
                       <div onClick={this.allMeasurments} className="imgDiv" >
                            
                            <RefreshIcon />
                        </div>
                        {/* <div onClick={this.getRows} className="imgDiv" >
                            
                            <PictureAsPdfIcon />
                        </div> */}
                        <Button style={{ marginLeft: '15px' }} variant="contained" color="primary" onClick={() => { this.props.drawerView('scales') }}>
                            {this.props.lang.back}
                        </Button>
                    </div>
                </div>
                {/* <Paper style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}> */}
                <Paper>
                    {/* <CalendarPicker
                        cb={this.allMeasurments}
                        lang={this.props.lang}
                    /> */}
                    <DataGrid
                        columnMinWidth={100} //minimalna szerokosc kolumny
                        columnAutoWidth={false} //wylączamy nieprzewidywalne działanie columnAutoWidth
                        dataSource={this.state.rows}
                        selection={{ mode: 'single' }}
                        rowAlternationEnabled={true} //co drugi wiersz ma inny kolor
                        showColumnLines={true} //pionowe bordery
                        allowColumnReordering={true} //drag and drop kolumn
                        showBorders={false}
                        // onContentReady={onContentReady}
                        // remoteOperations={true}
                        hoverStateEnabled={true}
                        // wordWrapEnabled={true}
                        style={{
                            padding: 5

                        }}
                        ref={this.dataGrid}
                        // marginLeft='auto'
                        // marginRight='auto'
                        // onSelectionChanged={this.onSelectionChanged}
                        // onRowDblClick={(e) => this.props.orderDetails(e.data)}
                        onToolbarPreparing={this.onToolbarPreparing}
                    >

                        {/*StateStoring - zapamiętywanie stanu tabeli*/}
                        <StateStoring enabled={true} />

                        {/*FilterRow - dodatkowy wiersz nagłówka z filtrami dla poszczególnych kolumn*/}
                        <FilterRow visible={true} />

                        {/*Export - Eksport to XLS*/}
                        <Export enabled={true} />

                        {/*ColumnChooser - wybornik kolumn*/}
                        <ColumnChooser enabled={true} mode={"select"} />


                        <GroupPanel visible={true}

                            emptyPanelText={
                                this.props.lang.dragColumn
                            }
                            onClick={console.log(this)}

                        />
                        <Grouping autoExpandAll={false} />
                        {/* <Scrolling mode={'virtual'} /> */}
                        <SearchPanel visible={false} />
                        <Paging defaultPageSize={15} />
                        <HeaderFilter visible={true} />
                        {/* <Sorting mode={'none'} /> */}
                        {/* <Scrolling mode={'infinite'}  /> */}
                        <LoadPanel enabled={false} />
                        <Pager
                            backgroundColor='red'
                            showPageSizeSelector={true}
                            allowedPageSizes={[10, 15, 20]}
                            showInfo={true}
                            infoText={`${this.props.lang.page} {0} ${this.props.lang.of}  {1}`}
                        />
                        <Column dataField={'measure_number'} caption={this.props.lang.measureNumber} width={70} />
                        <Column dataField={'product_name'} caption={this.props.lang.item} />
                        <Column dataField={'mass'} caption={this.props.lang.measure} />
                        <Column dataField={'unit'} caption={"j.m."}  />
                        {/*<Column dataField={'item'} caption={this.props.lang.item} width={"auto"} />*/}
                        <Column dataField={'time'} selectedFilterOperation={"between"} dataType={'date'} caption={this.props.lang.date} format={"yyyy.MM.dd hh:mm:ss"} defaultSortOrder="desc"  />
                        {/* <Column dataField={'time'} dataType={'date'} format={"yyyy/MM/dd"} width={100}/> */}
                        {/* <Column dataField={'name'} caption={this.props.lang.orderName} /> */}
                        <Column dataField={'order_name'} caption={this.props.lang.orderName} />
                        <Column dataField={'scale_name'} caption={this.props.lang.scaleName} />
                        <Column dataField={'operator_username'} caption={this.props.lang.operator} width={"auto"} />

                        <Column dataField={'tara'} caption={'Tara'}  />
                        <Column dataField={'mass_cal'} caption={'Masa w jednostce'}   visible={false}/>
                        <Column dataField={'unit_cal'} caption={'j.m. kalibracyjna'}  visible={false} />
                        <Column dataField={'is_stable'} caption={'Stabilny'}  visible={false} />
                        <Column dataField={'check_weighing'} caption={'Ważenie OK'}  visible={false}/>
                        <Column dataField={'batch'} caption={'Partia'}  />
                        <Column dataField={'series'} caption={'Seria'}  />
                        {/* <Column dataField={'time'} dataType={'date'} caption={this.props.lang.date} format={"yyyy/MM/dd"} />
                        <Column dataField={'time'} dataType={'date'} format={"yyyy/MM/dd"} width={100} />
                        <Column dataField={'operator'} caption={this.props.lang.operator} />
                        <Column dataField={'scale_name'} caption={this.props.lang.scaleName} /> */}

                        <Template name="totalGroupCount" render={this.toolbarItemRender} />

                        <Summary>
                            <TotalItem
                                column="measure_number"
                                summaryType="count" />

                            <TotalItem
                                column="mass"
                                summaryType="sum"
                               />
                        </Summary>

                    </DataGrid>
                </Paper>
            </div>
        )
    }
}

export default AllMeasurments;
