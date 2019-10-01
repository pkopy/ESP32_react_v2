

const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const findDevices = require('./api/findDevices')
const addDevice = require('./api/addDevice')
const scale = require('./api/scale')
const order = require('./api/order')
const item = require('./api/item')
const operators = require('./api/operators')
const pdf1 = require('./api/pdf')
const contractors = require('./api/contractors')
// const db = require('./db');
// const session = require('express-session');
// // const helpers = require('./helpers');
// const measrement = require('./api/measurement');
// const register = require('./api/register');
// const login = require('./api/login');
// const add = require('./api/add');
// const run = require('./api/run')

const server = {};
app.use(cors());
app.use(express.static('public'));

// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//         secure:'auto',
//         maxAge: 60000
//     }
// })
// );



app.all('/findScales', (req, res) => {
    findDevices.init(req, res)
});

app.all('/addDevice', (req, res) => {
    addDevice.init(req, res)
})

app.all('/scale', (req, res) => {
    scale.init(req, res)
})

app.all('/order', (req, res) => {
    order.init(req, res)
})

app.all('/item', (req, res) => {
    item.init(req, res)
})

app.all('/operators', (req, res) => {
    operators.init(req, res)
})

app.all('/pdf', (req, res) => {
    pdf1.init(req, res)
})

app.all('/contractors', (req, res) => {
    contractors.init(req, res)
})

// app.all('/add', (req, res) => {
//     add.init(req, res)
// })

// app.all('/run', (req, res) => {
//     run.init(req, res)
// })


server.init = () => {
    // db.update('scales', 'state', 0) 
    // .then(() => console.log('all scales are off'))
    // .catch((err) => console.log(err))

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

server.init()

//Export the module
module.exports = server;
