const PDFDocument = require('pdfkit');
const fs = require('fs')
// Create a document

data = [
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},
    {id:1, waga:12, uwagi:'cosik'},
    {id:2, waga:15, uwagi:'cosik'},
    {id:3, waga:16, uwagi:'cosik'},
    {id:4, waga:17, uwagi:'cosik'},

]
const doc = new PDFDocument;

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(fs.createWriteStream('output.pdf'));

// Embed a font, set the font size, and render some text
for (let i = 0; i < data.length; i++) {
    doc.moveDown();

    doc.text(`${data[i].id} -- ${data[i].waga} -- ${data[i].uwagi}`);
    doc.moveTo(0,20*(i+1))
        .lineTo(250,20*(i+1))
        .stroke()
}

// for (let item of data) {

// }

// Finalize PDF file
doc.end();