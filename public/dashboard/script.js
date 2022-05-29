function loadPanel(page) {
    fetch(`http://localhost:5000/getHTMLTemplate/${page}`)

        .then((response) => {
            return response.json();
        })

        .then((data) => {
            console.log(data)
            document.getElementById(`main`).innerHTML = data.result;
        })

        .catch((err) => {
            console.log(err)
        })
}