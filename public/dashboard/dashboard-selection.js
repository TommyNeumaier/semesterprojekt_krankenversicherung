function enterDashboard(cat) {
    fetch(`http://localhost:3000/auth/${cat}`)
        .then((response) => {
            return response.json();
        })

        .then((data) => {
            console.log(data)

            if (data.status) {
                document.getElementById(`dashboard-selection-error`).style.display = "none";

                switch (cat) {
                    case "patient":
                        window.location.href = ".";
                        break;
                    case "employee":
                        window.location.href = "./employee/";
                        break;
                    case "doctor":
                        window.location.href = "";
                        break;
                }
            } else {
                document.getElementById(`dashboard-selection-error`).style.display = "block";
            }

        })

        .catch((err) => {
            console.log(err)
        })
}