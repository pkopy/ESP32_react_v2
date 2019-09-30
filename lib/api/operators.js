const helpers = require('../helpers');
const db = require('../db')

const operators = {}

operators.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post','get'];
    if (acceptableMethods.indexOf(method) > -1) {
        operators[method](req, res);
    } else {
        helpers.response(res, 405);
    }
}

operators.post = (req, res) => {
    req.on('data', (data) => {
        let payload = Buffer.from(data).toString();
        let payloadObj = JSON.parse(payload)

        if (payloadObj.firstName && payloadObj.lastName) {
            data = {
                firstName: payloadObj.firstName,
                lastName: payloadObj.lastName,
                // name: payloadObj.firstName + ' ' + payloadObj.lastName
            }
            db.create('operators', data)
                .then(() => helpers.response(res, 200, {"Info":"operators is added"}))
                .catch((err) => helpers.response(res, 400, err))
        } else {
           helpers.response(res, 400, {"error":"missing fields"})
        }
    })
}

operators.get = (req, res) => {
    db.read('operators')
    .then(operators => helpers.response(res, 200, operators))
    .catch(err => console.log(err))
}

module.exports = operators