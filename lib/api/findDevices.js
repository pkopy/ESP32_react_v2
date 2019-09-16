/*
 *
 * Add scale API
 * 
 */

// Dependecies
const helpers = require('../helpers');
const udpClient = require('../udpClient')
const findAP = require('../findWifiAP')
const wifi = require("node-wifi");
const dotenv = require('dotenv');
// const wsAddress = require('../.data/esp32/esp32.json')
// console.log(wsAddress)
dotenv.config();
const IFACE = process.env.IFACE || null

const findDevices = {}

findDevices.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(method) > -1) {
        findDevices[method](req, res);
    } else {
        helpers.response(res, 405);
    }
};

findDevices.get = (req, res) => {
    // helpers.response(res, 200, wsAddress)
    const devices = [] 
    udpClient.findUdpDevices('start')
        .then(data => {
            
            console.log(data)
            // data = JSON.stringify(data)
            helpers.response(res, 200, data)
        })
        .catch(data => console.log(data))
    // wifi.init({
    //     iface: IFACE // network interface, choose a random wifi interface if set to null
    // });

    // wifi.scan()
    //     .then(data => {
    //         helpers.response(res, 200, data)
    //     })
        // .catch(err => console.log(data))
}

module.exports = findDevices;