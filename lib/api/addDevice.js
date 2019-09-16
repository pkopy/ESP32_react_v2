const helpers = require('../helpers');
const dataFS = require('../dataFS')
const db = require('../db')

const dotenv = require('dotenv');
dotenv.config();

const addDevice = {}

addDevice.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post','get'];
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
        // console.log(mm)
        if (mm.measure) {
            data = {
                measure:mm.measure,
                measureNumber:mm.measureNumber,
                orderguid:mm.orderguid
            }
            db.create('measurements', data)
                .then((data) => {
                    let z = JSON.stringify(mm);
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end()

                })
                .catch((data) => {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    console
                    res.end()

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
    console.log(order)
    db.read('measurements', 'orderguid', order)
        .then(measurements => helpers.response(res, 200, measurements))
        .catch(err => helpers.response(res, 200, []))
}

module.exports = addDevice