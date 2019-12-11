const helpers = require('../helpers');
const db = require('../db')
const uuid = require('uuid/v4');
const order = {}

order.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post', 'get', 'delete'];
    if (acceptableMethods.indexOf(method) > -1) {
        order[method](req, res);
    } else {
        helpers.response(res, 405);
    }
}

order.post = (req, res) => {
    req.on('data', (data) => {

        let payload = Buffer.from(data).toString();
        let payloadObj = JSON.parse(payload)
        console.log(payloadObj)
        if (payloadObj.name &&
            payloadObj.base &&
            payloadObj.operator &&
            payloadObj.max &&
            payloadObj.min &&
            payloadObj.threshold &&
            payloadObj.quantity &&
            payloadObj.scaleId &&
            payloadObj.scaleName &&
            payloadObj.guid
        ) {
            data = {
                guid: payloadObj.guid,
                name: payloadObj.name,
                base: payloadObj.base,
                operator: payloadObj.operator,
                max: payloadObj.max,
                min: payloadObj.min,
                threshold: payloadObj.threshold,
                quantity: payloadObj.quantity,
                scaleId: payloadObj.scaleId,
                scaleName: payloadObj.scaleName,
                intervalValue: payloadObj.intervalValue,
                type: payloadObj.type,
                manualWeighing: payloadObj.manualWeighing,
                item: payloadObj.item,
                tare: payloadObj.tare,
                unit: payloadObj.unit
            }
            console.log(data)
            db.create('orders', data)
            
                .then(() => helpers.response(res, 200))
                .catch((err) => {
                    
                    helpers.response(res, 400, err)
                
                })
        } else {
            helpers.response(res, 400, { "error": "missing fields" })
        }
    })
}

order.get = (req, res) => {
    const fromTime = req.headers.fromtime
    const toTime = req.headers.totime
    const order = req.headers.guid
    const scale = req.headers.scale
    if (fromTime && !toTime) {
        db.read({table:'orders', field:'guid', time1: fromTime})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (fromTime && toTime) {
        db.read({table:'orders', field:'guid', time1: fromTime, time2: toTime})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (order) {
        db.read({table:'orders', field:'guid', value: order})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (scale) {
        db.read({table:'orders', field:'scale', value: scale})
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else  {
        db.read({table:'orders'})
        .then(orders => helpers.response(res, 200, orders))
        .catch(err => helpers.response(res, 200, []))
    }   
}


order.delete = (req, res) => {
    const order = req.headers.guid
    db.delete('orders', 'guid', order)
        .then(data => helpers.response(res, 200, data))
        .catch(err => helpers.response(res, 400, err))
}

module.exports = order