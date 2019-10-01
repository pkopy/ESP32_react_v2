const PORT = process.env.REACT_APP_PORT || 5000;
const URL = process.env.REACT_APP_URL || 'localhost'
 
 export default  function createPdf (data) {
    // console.log(JSON.stringify(this.state.rows))
    // console.log(data)
    const dataObj = data
    fetch(`http://${URL}:${PORT}/pdf`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(response =>  response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a');
            const newDate = new Date()
            const name = dataObj.name ? dataObj.name : `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}  ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`
            a.style.display = 'none';
            a.href = url;
            // the filename you want
            a.download = `${name}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            // alert('your file has downloaded!');
            // console.log(blob)
        })
        .catch(() => alert('Nie można pobrać pliku'))


        .catch((err) => {
            console.log(err)
        })

}