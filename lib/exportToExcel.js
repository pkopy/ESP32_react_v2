const dataFS = require('./dataFS')
const XLSX = require('xlsx');


const lib = {};
lib.baseDir = path.join(__dirname, './.data')

lib.createRaport = (data) => {
    const workbook = XLSX.utils.book_new()
    const ws_name = "Arkusz1";
    const ws_data = [
        
    ]
    // for(let elem of data) {
    //     console.log(elem)
    //     ws_data.push([elem.n, elem.w])
    // }
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(workbook, ws, ws_name);
    
            // const workbook = XLSX.readFile('out.xlsx');
                    // const sheet = workbook.Sheets[worksheetName]
            const sheet = workbook.Sheets['Arkusz1']
            const dataLength = data.length
            let cell = XLSX.utils.encode_cell({c:3, r:dataLength})
            sheet['!ref'] = `A1:${cell}`
            console.log(sheet['!ref'])
            for(let i = 0; i < dataLength; i++) {
                let cell = XLSX.utils.encode_cell({c:0, r:i})
               
                
                
                sheet[cell]={v:data[i]['n']}
                let cellB = XLSX.utils.encode_cell({c:1, r:i})
                sheet[cellB]={v:data[i]['w']}
                console.log(cell)
            }
            // console.log(cell)
            // console.log(sheet['A3'])
            // var cellref = XLSX.utils.encode_cell({c:1, r:1})
            // cellref.v = 'ooooo'
            // console.log(cellref)
            // sheet[`${cellref}`] = { t: 'n' , v:data }
            
            
            XLSX.writeFile(workbook, 'out1.xlsx');
           

        
   
}

module.exports = lib;