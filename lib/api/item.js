const helpers = require('../helpers');
const db = require('../db')
const uuid = require('uuid/v4');
const url = require('url');

const item = {}


item.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post', 'get'];
    if (acceptableMethods.indexOf(method) > -1) {
        item[method](req, res);
    } else {
        helpers.response(res, 405);
    }
}

item.post = (req, res) => {
    req.on('data', (data) => {
        let payload = Buffer.from(data).toString();
        let payloadObj = JSON.parse(payload)

        if (payloadObj.id&&
            payloadObj.name 
            // payloadObj.isDirectory &&
            // 
            ) {

            data = {
                id: payloadObj.id,
                parentId: payloadObj.parentId,
                isDirectory: payloadObj.isDirectory,
                hasItems: payloadObj.hasItems,
                name:payloadObj.name,
                base:payloadObj.base,
                max:payloadObj.max,
                min:payloadObj.min,
                treshold:payloadObj.treshold


            }
            db.create('items', data)
                .then((data) => helpers.response(res, 200, data))
                .catch((err) => helpers.response(res, 400, err))
        } else {
            helpers.response(res, 400, { "error": "missing fields" })
        }
    })
}


item.get = (req, res) => {
    const query = url.parse(req.url, true).query;
    // console.log(query)
    // if (query)
    db.read('items', 'parentId', query.parentId)
        .then(items => helpers.response(res, 200, items))
        .catch(err => helpers.response(res, 200, []))
}
module.exports = item