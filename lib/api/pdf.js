const helpers = require('../helpers');
var pdf = require("pdf-creator-node");
var fs = require('fs');
var path = require('path')

const pdf1 = {}

pdf1.init = (req, res) => {
    const method = req.method.toLowerCase();
    const acceptableMethods = ['post', 'get'];
    if (acceptableMethods.indexOf(method) > -1) {
        pdf1[method](req, res);
    } else {
        helpers.response(res, 405);
    }
}

pdf1.post = (req, res) => {
    let body = []
    let start = ''
    let end = ''
    let rows=[]
    req.on('data', (data) => {
        body.push(data)
    })
    .on('end', () => {
        const timeFormat = (timeStr) => {
            return timeStr.replace('T', ' ').replace('.000Z', '')
        }

        let payload = Buffer.concat(body).toString();
        let payloadObj = JSON.parse(payload)
        console.log('PAY: ', payloadObj)
        if (payloadObj.measurments && payloadObj.measurments.length > 0) {
            start = timeFormat(payloadObj.measurments[0].time)
            
    
            let endIndex = payloadObj.measurments.length - 1
            end = timeFormat(payloadObj.measurments[endIndex].time)
            rows = payloadObj.measurments
        } else {
            rows = payloadObj
        }
        // console.log(endIndex)
        var html = fs.readFileSync('temp.html', 'utf8');
        

        var options = {
            format: "A4",
            orientation: "portrait",
            border: "5mm"
        };

        var document = {
            html: html,
            data: {
                allData: rows,
                start: start,
                end: end,
                order: payloadObj,
            },
            path: "./output.pdf"
        };

        var options1 = {
            root: path.join(__dirname, '/'),
            dotfiles: 'deny',
            headers: {
              'x-timestamp': Date.now(),
              'x-sent': true
            }
          }
        if (payloadObj) {



            pdf.create(document, options)
                .then(data => {
                    pdf1.get(req,res) 
                    // helpers.response(res, 200, data);
                    // console.log(res)
                })
                .catch(error => {
                    helpers.response(res, 400, error)
                    console.error(error)
                });

            
        } else {
            helpers.response(res, 400, { "error": "missing fields" })
        }
    })
}

pdf1.get = (req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./','output.pdf');
    // console.log(fileLocation);
    res.download(fileLocation, file); 
  };

module.exports = pdf1