const helpers = require('../helpers');
const db = require('../db')

const login = {}

login.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post','get'];
    if (acceptableMethods.indexOf(method) > -1) {
        login[method](req, res);
    } else {
        helpers.response(res, 405);
    }
}

login.post = (req, res) => {
    req.on('data', (data) => {
        let payload = Buffer.from(data).toString();
        let payloadObj = JSON.parse(payload)
        if (payloadObj.userName && payloadObj.password) {
            data = {
                userName: payloadObj.userName,
                password: payloadObj.password
                // name: payloadObj.firstName + ' ' + payloadObj.lastName
            }
            db.read('operators', 'userName', data.userName)
                .then((user) => helpers.response(res, 200, user))
                .catch((err) => helpers.response(res, 400, err))
        } else {
           helpers.response(res, 400, {"error":"missing fields"})
        }
    })
}

module.exports = login
