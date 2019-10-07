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
            payloadObj.treshold &&
            payloadObj.quantity &&
            payloadObj.scale &&
            payloadObj.scaleName
        ) {
            data = {
                name: payloadObj.name,
                command: payloadObj.command,
                base: payloadObj.base,
                operator: payloadObj.operator,
                max: payloadObj.max,
                min: payloadObj.min,
                treshold: payloadObj.treshold,
                quantity: payloadObj.quantity,
                scale: payloadObj.scale,
                scaleName: payloadObj.scaleName,
                guid: uuid(),
                interval: payloadObj.interval,
                intervalValue: payloadObj.intervalValue,
                type: payloadObj.type,
                manualWeighing: payloadObj.manualWeighing,
                item:payloadObj.item
            }
            db.create('orders', data)
                .then(() => helpers.response(res, 200, data.guid))
                .catch((err) => helpers.response(res, 400, err))
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
    console.log('order')
    console.log(toTime)
    if (fromTime && !toTime) {
        db.read('orders', 'guid', '_', fromTime)
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (fromTime && toTime) {
        console.log('to and from')
        db.read('orders', 'guid', '_',fromTime, toTime, )
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (order) {
        db.read('orders', 'guid', order)
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else if (scale) {
        console.log('scale')
        db.read('orders', 'scale', scale)
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else  {
        console.log('bez param')
        db.read('orders')
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