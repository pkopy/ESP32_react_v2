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
    
    const [data, setData] = React.useState([])
    const [chartData, setChartData] = React.useState([])

    React.useEffect(() => {
        const timer = setInterval(getMeasurements, 10000);

        return () => {
            clearInterval(timer);
        };
    }, [])
    React.useEffect(() => {
        getMeasurements()
    }, [])

    const getMeasurements = () => {
        fetch(`http://${props.host}:5000/addMeasurement`, {
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
                    let date = data[i].time.split('T')
                    data[i].date = date[0]
                    data[i].timeNew = date[1].slice(0,-5)
                    data[i].helpIndex =  50-i
                arr.push(data[i])
            }
            console.log(arr)
            const chartData = arr.reverse()
            console.log('chart',chartData)
            setData(chartData)
            // console.log('chart;',arr)
            setChartData(arr)

        })
        .catch(err => console.log(err))
    }

    return(
        <div style={{height: '100%'}}>

            {props.chart&&<Chart
    
                dataSource={chartData}
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
                    argumentField={'helpIndex'}
                    
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
                {/* <Column
                    caption={'Id'}
                    dataField={'internalId'}
                    defaultSortOrder={'desc'}
                    width={50}
                /> */}
                <Column
                    dataField={'time'}
                    defaultSortOrder={'desc'}
                    visible={false}
                />
                <Column
                    dataField={'date'}
                    
                    width={90}
                />
                <Column
                    dataField={'timeNew'}
                    caption={'Time'}
                    // defaultSortOrder={'desc'}
                    width={90}
                    // defaultSortOrder={'desc'}
                />
                <Column 
                    dataField={'item'}
                    caption={'Product'}
                />
                <Column
                    dataField={'tare'}
                />
                <Column 
                    dataField={'isStable'}
                    caption={'Stab'}
                />
                <Column
                    dataField={'measure'}
                    width={150}
                />
                <Column
                    dataField={'unit'}
                    width={50}
                />
                <Paging defaultPageSize={7} />

            </DataGrid>}
        </div>

        
    )
}