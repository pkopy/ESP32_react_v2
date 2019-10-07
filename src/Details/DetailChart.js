import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from 'devextreme-react/button';
import Chart, {
    ArgumentAxis,
    CommonSeriesSettings,
    Legend,
    Series,
    ValueAxis,
    ConstantLine,
    Label
} from 'devextreme-react/chart';


class DetailChart extends React.Component {
    constructor(props) {
        super(props);
 
        this.chartRef = React.createRef();
 
        this.getValue = () => {
            const x = this.textBox.getValueAxis()
        };
    }

    get textBox() {
        return this.chartRef.current.instance;
    }
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


    render() {
        console.log(this.props.data)
        // range1 = this.state.range?[this.props.data.base - this.props.data.min*1.1, this.props.data.base + this.props.data.max*1.1]:[]
        return (
            <Paper style={{ height: '800px' }}>
                <div style={{ margin: 20, textAlign: 'left', position: 'relative', left: '60px', top: '15px' }}>
                        <h2>Zlecenie:  {this.props.data.name}</h2>
                        <span style={{ marginRight: '10px' }}><b>Operator:</b> {this.props.data.operator}</span>
                        <span style={{ marginRight: '10px' }}><b>Ilość ważeń:</b> {this.props.data.quantity}</span>
                        <span style={{ marginRight: '10px' }}><b>Typ:</b> {this.props.data.type}</span>
                        <span style={{ marginRight: '10px' }}><b>Waga:</b> {this.props.data.scaleName}</span>
                        <span style={{ marginRight: '10px' }}><b>Ważony produkt:</b> {this.props.data.item}</span>
                    </div>
                    <div className="hr" style={{ width: '90%' }} />
                <Button text="Focus TextBox" onClick={() => {this.getValue(); this.setState({range1:[]})}} />
                
                <Chart ref={this.chartRef}
                    style={{ height: '70%', width: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '30px' }}
                    className='test'
                    // title={{
                    //     text:'Wykres zlecenia',
                    //     paddingTop: 10,
                    //     allignment: 'left'
                    // }}
                    animation={{

                        enabled:false
                    }}
                    // scrollBar={{
                    //     visible:false
                    // }}
                    zoomAndPan= {{
                        argumentAxis: "zoom",
                        // valueAxis: 'zoom'
                    }}
                    // visualRange={{
                    //     startValue: 100,
                    //     endValue: 120,

                    // }}
                    // scheduleHiding={false}
                    dataSource={this.props.rows}
                    // palette={'Harmony Light'}
                    id={'chart'}
                >
                    {/* <Title text={'Wykres'} margin={{ top: 50 }} >

                    </Title> */}
                    <ArgumentAxis allowDecimals={false}>
                        {/* <Label overlappingBehavior={'stagger'} /> */}
                    </ArgumentAxis>

                    <ValueAxis name={'frequency'} position={'left'} visualRange={this.state.range1}>
                    {/* <ValueAxis name={'frequency'} position={'left'} breaks={[{startValue: 100, endValue: 500 },
                { startValue: 1000, endValue: 2000 }]}> */}
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
                        visible={false}
                    />

                    <CommonSeriesSettings argumentField={'measureNumber'} />
                </Chart>
            </Paper>
        );
    }
}



export default DetailChart;
