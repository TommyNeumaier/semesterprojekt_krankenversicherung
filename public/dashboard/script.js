function loadPanel(page) {
    const storageObj = JSON.parse(sessionStorage['login_data']);
    console.log(storageObj)

    fetch(`http://localhost:5000/getHTMLTemplate/${storageObj.mail}/${storageObj.password}/${page}`)

        .then((response) => {
            return response.json();
        })

        .then((data) => {
            console.log(data)
            document.getElementById(`body`).innerHTML = data.result;
        })

        .catch((err) => {
            console.log(err)
        })
}

// done
function account_management_filter() {
        let input = document.getElementById("account-management-input-search-parameter");
        let filter = input.value.toUpperCase();
        let table = document.getElementById("account-management-table");
        let tr = table.getElementsByTagName("tr");
        for (let i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td")[document.getElementById(`account-management-search-parameter-list`).selectedIndex-1];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
}

function mitarbeiter_getProfileInformation() {
    const jsonObj = JSON.parse(sessionStorage['login_data']);
    fetch(`http://localhost:4000/getClientById/${jsonObj.id}/${jsonObj.mail}/${jsonObj.password}`)

        .then((response) => {
            return response.json();
        })

        .then((data) => {
            console.log(data)

            let arr = []
            console.log(Object.values(data));
        })

        .catch((err) => {
            console.log(err)
        })
}