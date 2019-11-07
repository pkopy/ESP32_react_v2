import React from 'react';

import Chart, {
  ArgumentAxis,
  Label,
  Size,
  Legend,
  Series,
} from 'devextreme-react/chart';



export default (props) => {
    // const data = [
    //     {arg:1, value:10},
    //     {arg:2, value:20},
    //     {arg:3, value:30},
    //     {arg:4, value:40},
    // ]

    console.log(props)
    const [data, setData] = React.useState([])

    React.useEffect(() => {
        fetch('http://localhost:5000/addDevice', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'scaleid':props.scaleId
            }
        })
        .then(data => data.json())
        .then(data => {
            console.log(data);
            setData(data)
        })
        .catch(err => console.log(err))
    }, data)

    return(
        <Chart
            dataSource={data}
            style={{height: '90%', width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px'}}
            >


            <ArgumentAxis tickInterval={10}>
                <Label format={'decimal'} />
            </ArgumentAxis>
            <Series
                type={'line'}
                valueField={'measure'}
            />
            <Legend
                visible={false}
            />

        </Chart>
    )
}