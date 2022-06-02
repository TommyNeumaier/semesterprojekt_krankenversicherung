function loadAccounts() {
    fetch("http://localhost:3000/getAllAccounts")

        .then((response) => {
            return response.json()
        })

        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                document.getElementById(`account-management-table-access`).innerHTML += `<tr>
                <td onclick="account_management_seemoredetails(this)" class="account-management-table-ids" data-bs-toggle="modal" data-bs-target="#editmodel">${data[i].id}</td>
                <td>${data[i].first_name} ${data[i].middle_name} ${data[i].last_name}</td>
                <td>${data[i].birthday}</td>
                <td>${data[i].nin}</td>
            </tr>`
            }
        })

        .catch((err) => {
            console.log(err)
        })
}

function account_management_filter() {
    let input = document.getElementById("account-management-input-search-parameter");
    let filter = input.value.toUpperCase();
    let table = document.getElementById("account-management-table");
    let tr = table.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td")[document.getElementById(`account-management-search-parameter-list`).selectedIndex - 1];
        if (td) {
            let txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

const PASSWORD_PATTERN = /^.*(?=.{8,})(?=.*\d)(?=.*[`!?\-.,`]).*$/;
const MAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/

function account_management_add() {
    let validationOk = true;

    if (MAIL_PATTERN.test(document.getElementById(`account-management-input-mail`).value)) {
        document.getElementById('error-mail').style.display = "none";
    } else {
        document.getElementById('error-mail').style.display = "block";
        validationOk = false;
    }

    if (PASSWORD_PATTERN.test(document.getElementById(`account-management-input-password`).value)) {
        document.getElementById('error-password').style.display = "none";
    } else {
        document.getElementById('error-password').style.display = "block";
    }

    if (validationOk) {
        let pushObj = {
            title: document.getElementById(`account-management-input-title`).value,
            first_name: document.getElementById(`account-management-input-firstname`).value,
            middle_name: document.getElementById(`account-management-input-middlename`).value,
            last_name: document.getElementById(`account-management-input-lastname`).value,
            birthday: document.getElementById(`account-management-input-birthday`).value,
            address: document.getElementById(`account-management-input-address`).value,
            postial_code: document.getElementById(`account-management-input-postialcode`).value,
            city: document.getElementById(`account-management-input-city`).value,
            district: document.getElementById(`account-management-input-district`).value,
            state: document.getElementById(`account-management-input-state`).value,
            phone: document.getElementById(`account-management-input-phone`).value,
            sex: document.getElementById(`account-management-input-sex`).value,
            mail: document.getElementById(`account-management-input-mail`).value,
            password: SHA1(document.getElementById(`account-management-input-password`).value),
            isDoctor: (document.getElementById(`account-management-is-doctor`).checked == true ? 1 : 0),
            isEmployee: (document.getElementById(`account-management-is-employee`).checked == true ? 1 : 0),
            nin: document.getElementById(`account-management-input-phone`).value.substring(document.getElementById(`account-management-input-phone`).value.length - 4, document.getElementById(`account-management-input-phone`).value.length) + document.getElementById(`account-management-input-birthday`).value.replace(".20", "").replace(".", "").replace(".19", "")
        }

        fetch("http://localhost:3000/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pushObj)
            }
        )

            .then((response) => {
                return response.json();
            })

            .then((data) => {
                console.log(data)
                window.location.reload();
            })

            .catch((err) => {
                console.log(err)
            })
    }
}

function account_management_seemoredetails(id) {
    let realID = parseInt(id.textContent);
    sessionStorage['see_more_details'] = realID;
    console.log(realID)

    fetch(`http://localhost:3000/getClientViaID/${realID}`)

        .then((response) => {
            return response.json()
        })

        .then((data) => {
            console.log(data)

            document.getElementById(`account-management-edit-firstname`).setAttribute("placeholder", `${data[0].first_name}`);
            document.getElementById(`account-management-edit-middlename`).setAttribute("placeholder", `${data[0].middle_name}`);
            document.getElementById(`account-management-edit-lastname`).setAttribute("placeholder", `${data[0].last_name}`);
            document.getElementById(`account-management-edit-address`).setAttribute("placeholder", `${data[0].address}`);
            document.getElementById(`account-management-edit-birthday`).setAttribute("placeholder", `${data[0].birthday}`);
            document.getElementById(`account-management-edit-sex`).setAttribute("placeholder", `${data[0].sex}`);
            document.getElementById(`account-management-edit-postialcode`).setAttribute("placeholder", `${data[0].postial_code}`);
            document.getElementById(`account-management-edit-city`).setAttribute("placeholder", `${data[0].city}`);
            document.getElementById(`account-management-edit-state`).setAttribute("placeholder", `${data[0].state}`);
            document.getElementById(`account-management-edit-district`).setAttribute("placeholder", `${data[0].district}`);
            document.getElementById(`account-management-edit-phone`).setAttribute("placeholder", `${data[0].phone_number}`);
            document.getElementById(`account-management-edit-mail`).setAttribute("placeholder", `${data[0].mail}`);
            document.getElementById(`account-management-edit-title`).setAttribute("placeholder", `${data[0].title}`);
        })

        .catch((err) => {
            console.log(err)
        })
}

function account_management_save() {
    let pushObj = {
        title: document.getElementById(`account-management-edit-title`).value,
        first_name: document.getElementById(`account-management-edit-firstname`).value,
        middle_name: document.getElementById(`account-management-edit-middlename`).value,
        last_name: document.getElementById(`account-management-edit-lastname`).value,
        birthday: document.getElementById(`account-management-edit-birthday`).value,
        address: document.getElementById(`account-management-edit-address`).value,
        sex: document.getElementById(`account-management-edit-sex`).value,
        postial_code: document.getElementById(`account-management-edit-postialcode`).value,
        city: document.getElementById(`account-management-edit-city`).value,
        district: document.getElementById(`account-management-edit-district`).value,
        state: document.getElementById(`account-management-edit-state`).value,
        phone: document.getElementById(`account-management-edit-phone`).value,
        mail: document.getElementById(`account-management-edit-mail`).value,
        password: SHA1(document.getElementById(`account-management-edit-password`).value),
        isDoctor: (document.getElementById(`account-management-edit-is-doctor`).checked == true ? 1 : 0),
        isEmployee: (document.getElementById(`account-management-edit-is-employee`).checked == true ? 1 : 0)
    }

    fetch(`http://localhost:3000/editClient/${sessionStorage['see_more_details']}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pushObj)
        }
    )

        .then((response) => {
            return response.json();
        })

        .then((data) => {
            console.log(data)
            window.location.reload();
        })

        .catch((err) => {
            console.log(err)
        })
}

function account_management_delete() {
    fetch(`http://localhost:3000/deleteClient/${sessionStorage['see_more_details']}`)

        .then((response) => {
            return response.json()
        })

        .then((data) => {
            console.log(data)
            window.location.reload();
        })

        .catch((err) => {
            console.log(err)
        })
}

function employeeInfo() {
    let id = JSON.parse(sessionStorage['user_data']).id;
    console.log(id)
    fetch(`http://localhost:3000/getClientViaID/${id}`)
        .then((response) => {
            return response.json()
        })

        .then((data) => {
            console.log(data)

            document.getElementById(`profile-employee-information`).innerHTML = `
            <strong>Name:</strong> ${data[0].title} ${data[0].first_name} ${data[0].middle_name} ${data[0].last_name}<br>
            <strong>Geschlecht:</strong> ${data[0].sex}<br>
            <strong>Adresse:</strong> ${data[0].address}, ${data[0].postial_code} ${data[0].city}, ${data[0].district}, ${data[0].state}<br>
            <strong>Telefonnummer:</strong> ${data[0].phone_number}<br>
            <strong>E-Mail-Adresse:</strong> ${data[0].mail}<br>
            <strong>Geburtstag:</strong> ${data[0].birthday}<br>
            <strong>Versicherungsnummer:</strong> ${data[0].nin}<br>
            <strong>ID:</strong> ${data[0].id}<br>
            <strong>Hat Patientenberechtigungen:</strong> ${data[0].patient == 1 ? true : false}<br>
            <strong>Hat Arztberechtigungen:</strong> ${data[0].doctor == 1 ? true : false}<br>
            <strong>Hat Mitarbeiterberechtigungen:</strong> ${data[0].employee == 1 ? true : false}<br>
            `
        })

        .catch((err) => {
            console.log(err)
        })
}