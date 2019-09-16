const helpers = require('../helpers');
const dataFS = require('../dataFS')
const db = require('../db')

const scale = {}

scale.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post','get'];
    if (acceptableMethods.indexOf(method) > -1) {
        scale[method](req, res);
    } else {
        helpers.response(res, 405);
    }
}

scale.post = (req, res) => {
    req.on('data', (data) => {
        let payload = Buffer.from(data).toString();
        let payloadObj = JSON.parse(payload)

        if (payloadObj.address && payloadObj.port) {
            data = {
                address: payloadObj.address,
                port: payloadObj.port,
                name: payloadObj.name
            }
            db.create('scales', data)
                .then(() => helpers.response(res, 200, {"Info":"Scale is added"}))
                .catch((err) => helpers.response(res, 400, err))
        } else {
           helpers.response(res, 400, {"error":"missing fields"})
        }
    })
}

scale.get = (req, res) => {
    db.read('scales')
    .then(scales => helpers.response(res, 200, scales))
    .catch(err => console.log(err))
}

module.exports = scale