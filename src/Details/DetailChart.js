import React from 'react';
import Paper from '@material-ui/core/Paper';

import Chart, {
    ArgumentAxis,
    CommonSeriesSettings,
    Legend,
    Series,
    Tooltip,
    ValueAxis,
    ConstantLine,
    Label
} from 'devextreme-react/chart';
import { Title } from 'devextreme-react/vector-map';

// import { complaintsData } from './data.js';
// const complaintsData = [
//     { complaint: 'Cold pizza', count: 1500 },
//     { complaint: 'Not enough cheese', count: 120 },
//     { complaint: 'Underbaked or Overbaked', count: 52 },
//     { complaint: 'Delayed delivery', count: 1123 },
//     { complaint: 'Damaged pizza', count: 321 },
//     { complaint: 'Incorrect billing', count: 89 },
//     { complaint: 'Wrong size delivered', count: 222 }
// ]


// const complaintsData = []

class DetailChart extends React.Component {
    // complaintsData = this.props.data
    state={
        range: true,
        data: this.props.data,
        range1: [this.props.data.base - this.props.data.min*1.1, this.props.data.base + this.props.data.max*1.1]
    }
componentWillUnmount = () => {
    this.setState({range1:''})
    console.log(this.state.range1)
}


setRange = () => {
    this.setState({range: !this.state.range}); 
    if (this.state.range) {
        this.setState({range1:[this.props.data.base - this.props.data.min*1.1, this.props.data.base + this.props.data.max*1.1]})
    } else {
        this.setState({range1:[]})
    }
    console.log(this.state.range1)
}

create = () => {
    return `<ValueAxis name={'frequency'} position={'left'} visualRange={this.state.range1}>
    <ConstantLine value={this.props.data.base + this.props.data.max} width={2} color={'#4cae4c'} dashStyle={'dash'}>
        <Label visible={true} />
    </ConstantLine>
    <ConstantLine value={this.props.data.base} width={2} color={'#fc3535'} dashStyle={'dash'}>
        <Label visible={true} />
    </ConstantLine>
    <ConstantLine value={this.props.data.base - this.props.data.min} width={2} color={'#4cae4c'} dashStyle={'dash'}>
        <Label visible={true} />
    </ConstantLine>
</ValueAxis>`
}

    render() {
        console.log(this.props.data)
        // range1 = this.state.range?[this.props.data.base - this.props.data.min*1.1, this.props.data.base + this.props.data.max*1.1]:[]
        return (
            <Paper style={{ height: '600px' }}>
                <div onClick={this.setRange}>HHHHHHH</div>
                <Chart
                    style={{ height: '90%', width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '30px' }}
                    className='test'
                    // title={{
                    //     text:'Wykres zlecenia',
                    //     paddingTop: 10,
                    //     allignment: 'left'
                    // }}
                    animation={{

                        enabled:false
                    }}
                    scrollBar={{
                        visible:true
                    }}
                    zoomAndPan= {{
                        argumentAxis: "both"
                    }}
                    visualRange={{
                        startValue: this.props.data.base - this.props.data.min*1.1,
                        endValue: this.props.data.base + this.props.data.max*1.1
                    }}
                    // scheduleHiding={false}
                    dataSource={this.props.rows}
                    // palette={'Harmony Light'}
                    id={'chart'}
                >
                    <Title text={'Wykres'} margin={{ top: 50 }} >

                    </Title>
                    <ArgumentAxis allowDecimals={false}>
                        {/* <Label overlappingBehavior={'stagger'} /> */}
                    </ArgumentAxis>

                    <ValueAxis name={'frequency'} position={'left'} >
                        <ConstantLine value={this.props.data.base + this.props.data.max} width={2} color={'#4cae4c'} dashStyle={'dash'}>
                            <Label visible={true} />
                        </ConstantLine>
                        <ConstantLine value={this.props.data.base} width={2} color={'#fc3535'} dashStyle={'dash'}>
                            <Label visible={true} />
                        </ConstantLine>
                        <ConstantLine value={this.props.data.base - this.props.data.min} width={2} color={'#4cae4c'} dashStyle={'dash'}>
                            <Label visible={true} />
                        </ConstantLine>
                    </ValueAxis>
                    {/* {this.create()} */}
                    <Series
                        name={'Wartość'}
                        valueField={'measure'}
                        axis={'frequency'}
                        type={'line'}
                        color={'#3f51b5'}
                        
                    />

                    <Legend
                        verticalAlignment={'top'}
                        horizontalAlignment={'center'}
                    />

                    <CommonSeriesSettings argumentField={'measureNumber'} />
                </Chart>
            </Paper>
        );
    }
}



export default DetailChart;
