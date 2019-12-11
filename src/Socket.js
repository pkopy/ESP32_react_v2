import React from 'react';


const lib = {}
// lib.connectToSocket = ''
lib.connectToSocket = (address, port) => {
    let connection ={}
    // if (port) {
    //     connection = new WebSocket(`ws://${address}:${port}`)
    // } else {

    //     connection = new WebSocket(`ws://${address}:7000`)
    // connection = new WebSocket(`ws://${props.host}:4000`)
    // }
    // const measure = ''
    // connection.onopen = () => {
    //     console.log('xxxxx')
    //     // let msg = {command: ""};
    //     // connection.send(JSON.stringify(msg));
    // }

    // connection.onmessage = (e) => {
    //     let data = e.data;
    //     const  measure = JSON.parse(data);
        
    // }

    // connection.onerror = (e) => {
    //     // this.changeStateButton()
    //     console.log('ERROR')
    // }
    return connection
}

lib.sendToSocket = (msg, connection) => {
    // var msg = {"command": "SI", 'base': 200, 'max':50, 'min':100,'quantity':3, 'treshold': 100};
        // connection.send();
    // this.setState({end:false})
    // this.setState({rows:[]})
    // this.setState({data:[]})
    
    
    connection.send(JSON.stringify(msg))
}

export default lib