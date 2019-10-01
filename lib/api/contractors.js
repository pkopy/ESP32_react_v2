const helpers = require('../helpers');
const db = require('../db')

const contractors = {}

contractors.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post', 'get'];
    if (acceptableMethods.indexOf(method) > -1) {
        contractors[method](req, res);
    } else {
        helpers.response(res, 405);
    }
};

contractors.post = (req, res) => {
    req.on('data', (data) => {
        // console.log("Data:" , data.toString())
        
        let payload = Buffer.from(data).toString();
        let payloadObj = JSON.parse(payload)
        // console.log(payloadObj)
        if (payloadObj.name && payloadObj.address) {
            data = {
                name: payloadObj.name,
                address: payloadObj.address,
                nip: payloadObj.nip ? payloadObj.nip: '--',
                tel: payloadObj.tel ? payloadObj.tel: '--'
            }
            db.create('contractors', data)
                .then((data) => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });

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


contractors.get = (req, res) => {
    const id = req.headers.id
   
    if (id) {
        db.read('contractors', 'id', id)
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    } else {
        // console.log('bez param')
        db.read('contractors')
            .then(orders => helpers.response(res, 200, orders))
            .catch(err => helpers.response(res, 200, []))
    }
}

module.exports = contractors