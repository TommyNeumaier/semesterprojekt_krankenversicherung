function getClients() {
    fetch("http://localhost:4000/getClients")

        .then((res) => {
            return res.json();
        })

        .then((data) => {
            return data;
        })

        .then((data) => {
            document.getElementById(`getClients`).innerHTML = ``;
            console.log(data);

            for (let i = 0; i < data.length; i++) {
                document.getElementById(`getClients`).innerHTML += `<div class="getClients-client"> 
                <p>${data[i].firstname} ${data[i].lastname}<br>${data[i].birthday.substring(0, 10)}<br>${data[i].address}, ${data[i].state}, ${data[i].country}<br>
                ${data[i].insurance_type}, ${data[i].role}<br>
                Telefonnummer: ${data[i].phone}<br>E-Mail-Adresse: ${data[i].mail}</p>
                </div>`;
            }
        })

        .catch((err) => {
            console.log(`ERR: ${err}`)
        })
}

function getClientById() {
    let pattern = new RegExp('^[1-9]\\d*$');
    const id = document.getElementById(`getClientById-id`).value;
    if (id.match(pattern)) {
        document.getElementById(`getClientById-result`).innerText = ``;

        fetch(`http://localhost:4000/getClientById/${id}`)

            .then((response) => {
                return response.json();
            })

            .then((data) => {
                return data;
            })

            .then((data) => {
                if (data.status != undefined) {
                    document.getElementById(`getClientById-result`).innerHTML = `<p>404 Client NOT FOUND</p>`;
                } else {
                    document.getElementById(`getClientById-result`).innerHTML = `<p>${data[0].firstname} ${data[0].lastname}, geboren am ${data[0].birthday.substring(0, 10)}</p>`;
                }
            })

            .catch((err) => {
                console.log(`ERR: ${err}`)
            })
    } else {
        document.getElementById(`getClientById-result`).innerHTML = `<p>Muss Integer > 0 sein</p>`;
    }
}

function addClient() {
    let newClient = {
        firstname: document.getElementById(`addClient-firstname`).value,
        lastname: document.getElementById(`addClient-lastname`).value,
        birthday: document.getElementById(`addClient-birthday`).value,
        address: document.getElementById(`addClient-address`).value,
        state: document.getElementById(`addClient-state`).value,
        country: document.getElementById(`addClient-country`).value,
        phone: document.getElementById(`addClient-phone`).value,
        mail: document.getElementById(`addClient-mail`).value,
        insurance_type: document.getElementById(`addClient-insurance_type`).value
    };

    fetch("http://localhost:4000/addClient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newClient)
    })

        .then((res) => {
            return res.json();
        })

        .then((data) => {
            return data;
        })

        .then((data) => {
            document.getElementById(`addclient-server-answer`).innerText = data.status;
        })

        .catch((err) => {
            console.log(`ERROR: ${err}`)
        })
}

function searchClients() {
    if (document.getElementById(`searchClients-params`).value == "Bitte wähle ...") {
        document.getElementById(`searchClients-result`).innerHTML = `<p>Nothing selected</p>`;
    } else if (document.getElementById(`searchClients-search`).value == undefined || document.getElementById(`searchClients-search`).value == "") {
        document.getElementById(`searchClients-result`).innerHTML = `<p>Search field empty</p>`;
    } else {
        let filter = document.getElementById(`searchClients-params`).options[document.getElementById(`searchClients-params`).selectedIndex].id;
        filter = filter.split("-");
        fetch(`http://localhost:4000/searchClients/${filter[1]}/${document.getElementById(`searchClients-search`).value}`)

            .then((response) => {
                return response.json();
            })

            .then((data) => {
                return data;
            })

            .then((data) => {
                console.log(data);

                if (data.status != undefined) {
                    document.getElementById(`searchClients-result`).innerHTML = `<p>404 Client NOT FOUND</p>`;
                } else {
                    document.getElementById(`searchClients-result`).innerHTML = `<p>${data[0].firstname} ${data[0].lastname}, geboren am ${data[0].birthday.substring(0, 10)}</p>`;
                }
            })

            .catch((err) => {
                console.log(`ERR: ${err}`);
            })
    }
}

function deleteClient() {
    let pattern = new RegExp('^[1-9]\\d*$');
    const id = document.getElementById(`deleteClient-id`).value;
    if (id.match(pattern)) {
        document.getElementById(`deleteClient-result`).innerText = ``;

        fetch(`http://localhost:4000/deleteClient/${id}`)

            .then((response) => {
                return response.json();
            })

            .then((data) => {
                return data;
            })

            .then((data) => {
                if (data.status == "404") {
                    document.getElementById(`deleteClient-result`).innerHTML = `<p>404 Client NOT FOUND</p>`;
                } else {
                    document.getElementById(`deleteClient-result`).innerHTML = `<p>${data.status}</p>`;
                }
                getClients()
            })

            .catch((err) => {
                console.log(`ERR: ${err}`)
            })
    } else {
        document.getElementById(`deleteClient-result`).innerHTML = `<p>Muss Integer > 0 sein</p>`;
    }
}

function loadEntriesEditClient() {
    fetch("http://localhost:4000/getClients")

        .then((response) => {
            return response.json();
        })

        .then((data) => {
            return data;
        })

        .then((data) => {
            console.log(data);

            document.getElementById(`editClient-clients`).innerHTML = `<option id="editClient-please-select">Bitte wählen ...</option>`;
            for (let i = 0; i < data.length; i++) {
                document.getElementById(`editClient-clients`).innerHTML +=
                    `<option id="editClient-${data[i].id}">${data[i].firstname} ${data[i].lastname} (${data[i].birthday})</option>`
            }
        })

        .catch((err) => {
            console.log(`ERR: ${err}`);
        })
}

function getEditFields() {
    let id = document.getElementById(`editClient-clients`).options[document.getElementById(`editClient-clients`).options.selectedIndex].id;
    id = id.split("-");
    id = id[1];
    sessionStorage[187] = id;

    fetch(`http://localhost:4000/getClientById/${id}/mail/pw`)

        .then((response) => {
            return response.json();
        })

        .then((data) => {
            return data;
        })

        .then((data) => {
            console.log(data);

            let box = document.getElementById("editClient-edit-fields");
            box.innerHTML += `<input type="text" class="editClient" id="editClient-firstname" placeholder="${data[0].firstname} ...">`;
            box.innerHTML += `<input type="text" class="editClient" id="editClient-lastname" placeholder="${data[0].lastname} ...">`;
            box.innerHTML += `<input type="text" class="editClient" id="editClient-birthday" placeholder="${data[0].birthday} ...">`;
            box.innerHTML += `<input type="text" class="editClient" id="editClient-address" placeholder="${data[0].address} ...">`;
            box.innerHTML += `<input type="text" class="editClient" id="editClient-state" placeholder="${data[0].state} ...">`;
            box.innerHTML += `<input type="text" class="editClient" id="editClient-country" placeholder="${data[0].country} ...">`;
            box.innerHTML += `<input type="text" class="editClient" id="editClient-mail" placeholder="${data[0].mail} ...">`;
            box.innerHTML += `<input type="text" class="editClient" id="editClient-phone" placeholder="${data[0].phone} ...">`;
            box.innerHTML += `<input type="text" class="editClient" id="editClient-insurance_type" placeholder="${data[0].insurance_type} ...">`;
            box.innerHTML += `<button type="submit" onclick="editClient()"><a>Senden ...</a></button>`
        })

        .catch((err) => {
            console.log(`ERR: ${err}`)
        })
}

function editClient() {
    /*for (let i = 0; i < document.getElementsByClassName("editClient").length; i++) {
        if(document.getElementsByClassName("editClient")[i] == "" || document.getElementsByClassName("editClient")[i] == undefined) {
            docume
        }
    }*/
    let client = {
        id: parseInt(sessionStorage[187]),
        firstname: document.getElementById(`editClient-firstname`).value,
        lastname: document.getElementById(`editClient-lastname`).value,
        birthday: document.getElementById(`editClient-birthday`).value,
        address: document.getElementById(`editClient-address`).value,
        state: document.getElementById(`editClient-state`).value,
        country: document.getElementById(`editClient-country`).value,
        phone: document.getElementById(`editClient-phone`).value,
        mail: document.getElementById(`editClient-mail`).value,
        insurance_type: document.getElementById(`editClient-insurance_type`).value
    };

    fetch("http://localhost:4000/editClient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(client)
    })

        .then((res) => {
            return res.json();
        })

        .then((data) => {
            return data;
        })

        .then((data) => {
            document.getElementById(`editClient-result`).innerText = data.status;
        })

        .catch((err) => {
            console.log(`ERROR: ${err}`)
        })
}

loadEntriesEditClient();
getClients();