import XLSX from 'xlsx'

export default function exportToXLS (data) {
    const workbook = XLSX.utils.book_new()
    const ws_name = "Arkusz1";
    const ws_data = [];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(workbook, ws, ws_name);
    const dataLength = data.rows.length
    let cellR = XLSX.utils.encode_cell({ c: 4, r: dataLength })
    const sheet = workbook.Sheets['Arkusz1']
    sheet['!ref'] = `A1:${cellR}`
    sheet[XLSX.utils.encode_cell({ c: 0, r: 0 })] = { v: 'Numer Ważenia' }
    sheet[XLSX.utils.encode_cell({ c: 1, r: 0 })] = { v: 'Wartość ważenia' }
    console.log(sheet['!cols'])
    var wscols = [
        { wch: 6 },
        { wch: 7 },
        { wch: 25 },

    ];

    sheet['!cols'] = wscols;
    for (let i = 0; i < dataLength; i++) {
        let cellA = XLSX.utils.encode_cell({ c: 0, r: i + 1 })
        sheet[cellA] = { v: data.rows[i]['measureNumber'] }
        let cellB = XLSX.utils.encode_cell({ c: 1, r: i + 1 })
        sheet[cellB] = { v: data.rows[i]['measure'], t: 'n'}
        let cellC = XLSX.utils.encode_cell({ c: 2, r: i + 1 })
        sheet[cellC] = { v: data.rows[i]['time'] }
        let cellD = XLSX.utils.encode_cell({ c: 3, r: i + 1 })
        sheet[cellD] = { v:  data.rows[i]['item'] && data.rows[i]['item'] !== 0 ? data.rows[i]['item'] : '---'}

    }
    const newDate = new Date()
    const fileName = data.name ? `${data.name}.xlsx` : `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}  ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}.xlsx`
    console.log(workbook)
    XLSX.writeFile(workbook, fileName);

    // saveAs(new Blob([wbout],{type:"application/octet-stream"}), "test.xlsx")
    // var blob = new Blob([wbout], {type:"application/octet-stream"});
    // saveAs(blob, "test.xlsx");

}