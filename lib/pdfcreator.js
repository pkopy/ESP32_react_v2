var pdf = require("pdf-creator-node");
var fs = require('fs');
 
// Read HTML Template

const createPdf = (arrayData) => {
    var html = fs.readFileSync('temp.html', 'utf8');
    
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm"
    };
    
    
    var document = {
        html: html,
        data: {
            allData:arrayData
        },
        path: "./output.pdf"
    };
    
    pdf.create(document, options)
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        });

}

module.exports = createPdf

