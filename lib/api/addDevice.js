const helpers = require('../helpers');
const dataFS = require('../dataFS')
const db = require('../db')

const dotenv = require('dotenv');
dotenv.config();

const addDevice = {}

addDevice.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post', 'get'];
    if (acceptableMethods.indexOf(method) > -1) {
        addDevice[method](req, res);
    } else {
        helpers.response(res, 405);
    }
};

addDevice.post = (req, res) => {
    req.on('data', (data) => {
        
        let payload = Buffer.from(data).toString();
        let mm = JSON.parse(payload)
        console.log(mm)
        if (mm.measure) {
            data = {
                measure: mm.measure,
                measureNumber: mm.measureNumber,
                orderguid: mm.orderguid,
                item:mm.item,
                operator:mm.operator,
                // name:mm.name,
                serialScale:mm.scaleName
            }
            db.create('measurements', data)
                .then((data) => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });

                    res.end()
                })
                .catch(() => {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    res.end('Error')
                })


        } else {
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });
            res.end('Missing data')
        }
    })
    // dataFS.create('esp32','esp32',req.query, (data) => console.log(data))
}


addDevice.get = (req, res) => {
    const order = req.headers.orderguid
    // console.log(order)
    // db.read('measurements', 'orderguid', order)
    //     .then(measurements => helpers.response(res, 200, measurements))
    //     .catch(err => helpers.response(res, 200, []))
    // db.leftJoin()
    //     .then(orders => helpers.response(res, 200, orders))
    //     .catch(err => helpers.response(res, 200, []))
    const fromTime = req.headers.fromtime
    const toTime = req.headers.totime
    // const order = req.headers.guid
    // const scale = req.headers.scale
    // console.log('order')
    // console.log(toTime)
    if (fromTime && !toTime) {
        db.read('measurements', 'orderguid', '_', fromTime)
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (fromTime && toTime) {
        // console.log('to and from')
        db.read('measurements', 'orderguid', '_', fromTime, toTime)
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (order) {
        db.read('measurements', 'orderguid', order)
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else {
        // console.log('bez param')
        db.read('orders')
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    }
}

module.exports = addDevice