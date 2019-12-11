import React, { useState, useEffect } from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';

export default (props) => {
    const [showEmployeeInfo, setShowEmployeeInfo] = useState(false)
    const [selectedRowNotes, setSelectedRowNotes] = useState('')
    const [measurments, setMeasurments] = useState([])
    // state = {
    //     showEmployeeInfo: false,
    //     selectedRowPicture: '',
    //     selectedRowNotes: ''
    // };
    const employees = [{
        'ID': 1,
        'FirstName': 'John',
        'LastName': 'Heart',
        'Prefix': 'Mr.',
        'Position': 'CEO',
        'Picture': 'images/employees/01.png',
        'BirthDate': '1964/03/16',
        'HireDate': '1995/01/15',
        'Notes': 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        'Address': '351 S Hill St.'
    }, {
        'ID': 20,
        'FirstName': 'Olivia',
        'LastName': 'Peyton',
        'Prefix': 'Mrs.',
        'Position': 'Sales Assistant',
        'Picture': 'images/employees/09.png',
        'BirthDate': '1981/06/03',
        'HireDate': '2012/05/14',
        'Notes': 'Olivia loves to sell. She has been selling DevAV products since 2012. \r\n\r\nOlivia was homecoming queen in high school. She is expecting her first child in 6 months. Good Luck Olivia.',
        'Address': '807 W Paseo Del Mar'
    }]

    const onSelectionChanged = ({ selectedRowsData }) => {
        const data = selectedRowsData[0];
        setShowEmployeeInfo(true)
        setSelectedRowNotes(data.scaleName)
        // this.setState({showEmployeeInfo: true,
        //     selectedRowNotes: data.Notes
        // });
    }

    const allMeasurments = (start, end) => {
        if (!start || !end) {
            const today = new Date()
            // console.log('xxx',new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}` +86400000))
            const newDate = Date.parse(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
            start = new Date(newDate - (86400000 * 30))
            end = new Date((newDate + (86400000 * 1)))
        }
        fetch(`http://${props.host}:5000/addMeasurement`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'fromtime': `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
                'totime': `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`

            }
        })
            .then(data => data.json())
            .then(measurments => {
                setMeasurments(measurments)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        allMeasurments()
    }, [])

    return (
        <React.Fragment>
            <DataGrid
                dataSource={measurments}
                selection={{ mode: 'single' }}
                showBorders={false}
                hoverStateEnabled={true}
                keyExpr={'id'}
                onSelectionChanged={(x) => onSelectionChanged(x)}
            >
                <Column dataField={'measureNumber'} width={180} />
                <Column dataField={'orderguid'} caption={'Title'} width={70} />
                <Column dataField={'operator'} />
                <Column dataField={'scaleName'} />
                <Column dataField={'time'} dataType={'date'} />
                <Column dataField={'HireDate'} dataType={'date'} />
            </DataGrid>
            {
                showEmployeeInfo &&
                <div id={'employee-info'}>

                    <p className={'employee-notes'}>{selectedRowNotes}</p>
                </div>
            }
        </React.Fragment>
    );
}

