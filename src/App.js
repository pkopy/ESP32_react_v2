import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, { Component } from 'react';
import  './App.scss'
import Drawer from './Drawer'
import Loader from './helpers/Loader'
import plLang from './Lang/pl'
// eslint-disable-next-line
import Test from './helpers/Test';
// import purple from '@material-ui/core/colors/purple';
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
// eslint-disable-next-line
import PDF from './helpers/pdfPrint'

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
        raport: false,
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
        socket: {},
        socketStatus:false,
        count:0,
        connection:true

    }
    componentDidMount = () => {
        this.yourScales()
        this.orders()
        this.operators()
        this.socket()
    }

    reset() {
        setTimeout(() => this.socket(), 2000) 
        console.log('ostatni')
        return

    }

    
    
    socket = () => {
        const socket = new WebSocket('ws://10.10.3.141:4000')
        this.setState({connection: true})
        socket.onopen = () => {
            // this.gen.next().done= true
            this.setState({count:0})
            this.setState({socketStatus:true})
            this.setState({connection: false})
            console.log('connect')
        }
        socket.onclose = () => {
            if (this.state.count < 3) {
                this.reset()
                this.setState({count:this.state.count+1})
                this.setState({connection: false})
            } else {

                // alert('Socket rozłączony')
            }
            // this.socket()
            
        }
        socket.onerror = () => {
            // alert('błąd socket')
            this.setState({socketStatus:false})
            this.setState({connection: false})
        }
        this.setState({socket})
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
            {!this.state.raport&&<Drawer
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
                socket={this.state.socket}
                socketStatus={this.state.socketStatus}
                resetSocket={this.socket}
                connection={this.state.connection}
                
            />}
            {/* <PDF/> */}
            {/* <button onClick={() =>Test('xxx')}>XXXXX</button> */}
        </div>
      );
    }
}

export default App;
