import React from 'react';

import Chart, {
  ArgumentAxis,
  CommonSeriesSettings,
  Label,
  Tooltip,
  Legend,
  Series,
} from 'devextreme-react/chart';
import DataGrid, {Paging, Column} from 'devextreme-react/data-grid';




export default (props) => {
    // const data = [
    //     {arg:1, value:10},
    //     {arg:2, value:20},
    //     {arg:3, value:30},
    //     {arg:4, value:40},
    // ]

    // console.log(props)
    const [data, setData] = React.useState([])

    React.useEffect(() => {
        const timer = setInterval(getMeasurements, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [])

    const getMeasurements = () => {
        fetch('http://localhost:5000/addDevice', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'scaleid':props.scaleId,
                'orderbyfield':'internalId'
            }
        })
        .then(data => data.json())
        .then(data => {
            // console.log(data);
            let arr = []
            // let rows = []
            let x = 0;
            
            
            for (let i = 0; i < data.length; i++) {
                    data[i].helpId = i
                arr.push(data[i])
            }
            setData(arr)
        })
        .catch(err => console.log(err))
    }

    return(
        <div style={{height: '100%'}}>

            {props.chart&&<Chart
    
                dataSource={data}
                style={{height: '90%', width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px'}}
                // selectionStyle={{symbol:'cross'}}
                id={'chart'}
                >
    
    
                <ArgumentAxis tickInterval={10}>
                    <Label format={'decimal'} />
                    <Label overlappingBehavior={'stagger'} />
                </ArgumentAxis>
                <Series
                    name={'mass'}
                    valueField={'measure'}
                    argumentField={'helpId'}
                    
                    type={'line'}
                />
                <Legend
                    visible={false}
                />
                <Tooltip
                enabled={true}
                shared={true}
                // customizeTooltip={this.customizeTooltip}
              />
                        {/* <CommonSeriesSettings argumentField={'id'} /> */}
    
            </Chart>}
            {!props.chart&&<DataGrid
                dataSource={data}
                // columns={['helpId', 'measure']}
                showBorders={true}
                style={{height: '90%', width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px'}}
            >
                <Column
                    dataField={'time'}
                    defaultSortOrder={'desc'}
                />
                <Column
                    dataField={'measure'}
                />
                <Paging defaultPageSize={7} />

            </DataGrid>}
        </div>

        
    )
}