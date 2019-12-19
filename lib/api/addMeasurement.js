const helpers = require('../helpers');
const db = require('../db')

const dotenv = require('dotenv');
dotenv.config();

const addMeasurement = {}

addMeasurement.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post', 'get'];
    if (acceptableMethods.indexOf(method) > -1) {
        addMeasurement[method](req, res);
    } else {
        helpers.response(res, 405);
    }
};

addMeasurement.post = (req, res) => {
    req.on('data', (data) => {
        
        let payload = Buffer.from(data).toString();
        let mm = JSON.parse(payload)
        console.log(mm)
        if (mm.measure) {
            data = {
                measure: mm.measure,
                measure_number: mm.measureNumber,
                order_guid: mm.orderguid,
                product_name: mm.item,
                operator: mm.operator,
                // name:mm.name,
                serial_name: mm.scaleName
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


addMeasurement.get = (req, res) => {
    const order = req.headers.orderguid
    const scaleId = req.headers.scaleid
    const orderByField = req.headers.orderbyfield
    // console.log('scalke:',orderByField)
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
    console.log('order')
    console.log(toTime)
    console.log(fromTime)
    if (fromTime && !toTime) {
        console.log('from')
        db.read({table:'measurements', field:'guid', fromTime})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (fromTime && toTime) {
        console.log('to and from')
        db.read({table:'measurements', field:'guid', value:'empty',time1:fromTime, time2:toTime})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (order) {
        db.read({table:'measurements', field:'guid', value: order})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (scaleId && orderByField) {
        db.read({table:'measurements', field:'scale_guid', value: scaleId, orderByField, sort:'desc', limit:50})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => {console.log(err);helpers.response(res, 200, [])}) 
    } else if (scaleId) {
        db.read({table:'measurements', field:'scale_guid', value: scaleId})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))

    } else {
        // console.log('bez param')
        db.read({table:'orders'})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    }
}

module.exports = addMeasurement