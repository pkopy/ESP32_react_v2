/*
 *
 * Library for finding UDP devices
 * 
 */


// Dependencies
const PORT = 1234;
const broadcastAddress = "10.10.255.255";
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
// const client = dgram.createSocket("udp4");

// let message = Buffer.from('ooo\n');


const lib = {};

lib.findUdpDevices = (mess) => {
    let message = Buffer.from(mess+'\n')
    return new Promise((res, rej) => {
        client.bind();
        client.on("listening", function () {
            client.setBroadcast(true);
            client.send(message, 0, message.length, PORT, broadcastAddress, function(err, bytes) {
                // client.close();
            });
        });
        
        client.on('message', function (message1, rinfo) {
            if (message1) {
                console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message1);
                res(message1)
                client.close()
            } else {
                rej('Error: ')
            }
        });
    })

}


module.exports = lib;
