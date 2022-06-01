function greeting() {
    if(sessionStorage.length != 0) {
        let jsonObj = JSON.parse(sessionStorage['user_data'])
        document.getElementById(`overview-welcome`).innerText += ` ${jsonObj.first_name} ${jsonObj.middle_name} ${jsonObj.last_name}!`;
    }
}

function checkPermission(cat) {
    fetch(`http://localhost:3000/auth/${cat}`)
        .then((response) => {
            return response.json();
        })

        .then((data) => {
            console.log(data)
            if (!data.status) {
                document.getElementById(`wrapper`).style.display = "block";
                document.getElementById(`wrapper`).innerHTML = `<div id="dashboard-login-error" class="alert alert-danger" style="text-align: center;"
        <strong>Fehler:</strong> Du hast nicht die Befugnis, in diese Ansicht zu wechseln.
    </div>`;
            }
        })

        .catch((err) => {
            console.log(err)
        })
}