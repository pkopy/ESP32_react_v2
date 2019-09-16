/*
 *
 * Library for finding UDP devices
 * 
 */


// Dependencies
const PORT = 1234;
const broadcastAddress = "10.10.255.255";

// const client = dgram.createSocket("udp4");

// let message = Buffer.from('ooo\n');


const lib = {};

lib.findUdpDevices = (mess) => {
    const dgram = require('dgram');
    const client = dgram.createSocket('udp4');
    let message = Buffer.from(mess+'\n')
    const devices = []
    return new Promise((res, rej) => {
        client.bind();
        client.on("listening", function () {
            client.setBroadcast(true);
            client.send(message, 0, message.length, PORT, broadcastAddress, function(err, bytes) {
                // client.close();
            });
        });
        
        client.on('message', function (message1, rinfo) {
            // console.log(rinfo)
            
            if (rinfo) {

                const device = {address: rinfo.address, port: rinfo.port, message:message1.toString()} 
                // console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message1);
                devices.push(device)
                // lib.findUdpDevices('oooo')
            } else {
                client.close()
                rej('Error: ')
            }
            
        });
        setTimeout(() => {
            client.close()
            res(devices)
        }, 5000)
    })


}


module.exports = lib;
