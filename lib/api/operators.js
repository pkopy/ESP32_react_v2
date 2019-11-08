const helpers = require('../helpers');
const db = require('../db')

const operators = {}

operators.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post', 'get'];
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

        if (payloadObj.firstName && payloadObj.lastName && payloadObj.userName && payloadObj.password) {
            data = {
                firstName: payloadObj.firstName,
                lastName: payloadObj.lastName,
                userName: payloadObj.userName,
                password: payloadObj.password,
                right: payloadObj.right
                // name: payloadObj.firstName + ' ' + payloadObj.lastName
            }
            db.read({table:'operators', field:'userName', value:data.userName})
                .then(user => {
                    if (user[0].userName === data.userName) {
                        helpers.response(res, 200, { "err": `User ${data.userName} already exist` })
                    }
                })
                .catch(() => {
                    db.create('operators', data)
                            .then(() => helpers.response(res, 200, { "Info": "operators is added" }))
                            .catch((err) => helpers.response(res, 400, err))
                })
            
        } else {
            helpers.response(res, 400, { "error": "missing fields" })
        }
    })
}

operators.get = (req, res) => {
    db.read({table:'operators'})
        .then(operators => {
            for (let elem of operators) {
                delete elem.password
            }
            // console.log(operators)
            helpers.response(res, 200, operators)})
        .catch(err => console.log(err))
}

module.exports = operators