 export default  function createPdf (data) {
    // console.log(JSON.stringify(this.state.rows))
    const host =process.env.NODE_ENV !== 'production'? '10.10.3.57' : window.location.hostname
    const dataObj = data
    fetch(`http://${host}:5000/pdf`, {
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