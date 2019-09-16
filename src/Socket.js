import React from 'react';


const lib = {}
// lib.connectToSocket = ''
lib.connectToSocket = (address) => {
    const connection = new WebSocket(`ws://${address}:7000`)
    // const measure = ''
    connection.onopen = () => {
        
        // let msg = {command: ""};
        // connection.send(JSON.stringify(msg));
    }

    connection.onmessage = (e) => {
        let data = e.data;
        const  measure = JSON.parse(data);
        
    }

    connection.onerror = (e) => {
        // this.changeStateButton()
        console.log('ERROR')
    }
    return connection
}

lib.sendToSocket = (msg, connection) => {
    // var msg = {"command": "SI", 'base': 200, 'max':50, 'min':100,'quantity':3, 'treshold': 100};
        // connection.send();
    // this.setState({end:false})
    // this.setState({rows:[]})
    // this.setState({data:[]})
    const x = 
    
    connection.send(JSON.stringify(msg))
}

export default lib