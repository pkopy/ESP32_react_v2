import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, { Component } from 'react';
import  './App.scss'
import Drawer from './Drawer'
import Loader from './helpers/Loader'
import plLang from './Lang/pl'
import Test from './helpers/Test';
// import purple from '@material-ui/core/colors/purple';
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#f44336',
    },
  },
});



const dotenv = require('dotenv');
dotenv.config();

class App extends Component {
    state ={
        load: false,
        newOrder: false,
        details:false,
        findedScales: [],
        scales: [],
        currentScale: {},
        end:false,
        yourOrders:[],
        measure:'',
        operators:[],
        lang:localStorage.getItem('lang') ? JSON.parse(localStorage.getItem('lang')) : plLang,
    }
    componentDidMount = () => {
        this.yourScales()
        this.orders()
        this.operators()
    }

    operators = () => {fetch('http://localhost:5000/operators', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(data => data.json())
        .then(operators => {
            this.setState({operators})
        })
        .catch(err => console.log(err))
    }

    orders = () => {
        this.setState({load: true})
        fetch('http://localhost:5000/order')
            .then(data => data.json())
            .then(yourOrders => {
                if (yourOrders.length > 0 ) {
                    for (let order of yourOrders) {
                        switch (order.status) {
                            case 0:
                                order.status = 'Trwa'
                                break
                            case 1:
                                order.status = 'Zakończone'
                                break
                            case 2:
                                order.status = 'Przerwane'
                                break
                            default:
                                order.status = 'Nieznany'
                        }
                    }
                    this.setState({yourOrders})
                    this.setState({load: false})

                } else {
                    this.setState({yourOrders:[]})
                    this.setState({load: false})
                }
                
            })
            .catch((err) => {
                this.setState({load: false})
            })
    }

    yourScales = () => {
        this.setState({load: true})
        fetch('http://localhost:5000/scale')
            .then(data => data.json())
            .then(data => {
                this.setState({scales: data});
                this.setState({load: false})
            })
            .catch((err) => {
                this.setState({load: false})
            })
    }
    findScales = () => {
        this.setState({load:true})
        this.setState({currentScale:{}})
        fetch(`http://localhost:5000/findscales`)
            .then(data => data.json())
            .then(data => {
                this.setState({findedScales: data});
                this.setState({load: false})
            })
            .catch(err => {
                setTimeout(() => {
                    this.setState({load: false})

                }, 2000)
            })
    } 

    changeLang = (lang) => {
        this.setState({lang})
        localStorage.setItem('lang', JSON.stringify(lang))
    }

    changeTheme = (color) => {
        this.setState({color})
        localStorage.setItem('color', JSON.stringify(color))
    }
    
    setScale = (scale) => {   
        this.setState({currentScale:scale})
        this.setState({details:true})
    }

    setMeasure = (measure) => {
        this.setState({measure})
    }

    changeNewOrderStatus = () => {
        this.setState({newOrder:!this.state.newOrder})
    }

    render () {
        return (
        <div className="App">
            {this.state.load&&<Loader />}
            <Drawer
                address={this.state.currentScale.address}
                findScales={this.findScales}
                yourScales={this.yourScales}
                orders={this.orders}
                newOrder={this.state.newOrder}
                changeNewOrderStatus={this.changeNewOrderStatus}
                scales={this.state.scales}
                yourOrders={this.state.yourOrders}
                measure={this.state.measure}
                setMeasure={this.setMeasure}
                operators={this.state.operators}
                updateOperators={this.operators}
                lang={this.state.lang}
                changeLang={this.changeLang}
                
            />
            {/* <button onClick={() =>Test('xxx')}>XXXXX</button> */}
        </div>
      );
    }
}

export default App;
