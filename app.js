const port = 3000;
const express = require("express");
const app = express();
const crypto = require("crypto");
let session = require("express-session");
let cookieParser = require("cookie-parser");

let sessionsStoraged = {
    patients: [],
    doctors: [],
    employees: []
};

app.use(cookieParser());
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

const mysql = require("mysql");

let sql = mysql.createConnection({
    host: "sql.tommyneumaier.at",
    user: "medt",
    password: "tOKvR53i2j48HuhI",
    database: "medt"
});

sql.connect((err) => {
    if (err) throw err;
    console.log("Connected");
});

app.use("/", express.static("public"));

app.get("/auth/:category", (req, res) => {
    let status;
    switch(req.params.category) {
        case "patient":
            status = checkPatientPermission(req.session.id)
            res.send({status: status});
            break;
        case "doctor":
            status = checkDoctorPermission(req.session.id)
            res.send({status: status});
            break;
        case "employee":
            status = checkEmployeePermission(req.session.id)
            res.send({status: status});
            break;
    }
});

app.get("/login/:nin/:password", (req, res) => {
    const nin = req.params.nin;
    const password = req.params.password;
    const sql_command = `SELECT * FROM \`users\` WHERE \`password\` = '${password}' AND \`nin\` = '${nin}'`;
    sql.query(sql_command, (err, result, fields) => {
        if (err) throw err;
        if (result.length == 0) res.send({status: false});
        else {
            if (result[0].patient == 1) {
                if(!checkPatientPermission(req.session.id)) {
                    sessionsStoraged.patients.push(req.session.id);
                    console.log(req.session.id + " pushed to patient")
                }
            }

            if (result[0].doctor == 1) {
                if(!checkDoctorPermission(req.session.id)) {
                    sessionsStoraged.doctors.push(req.session.id);
                    console.log(req.session.id + " pushed to doctor")
                }
            }

            if (result[0].employee == 1) {
                if(!checkEmployeePermission(req.session.id)) {
                    sessionsStoraged.employees.push(req.session.id);
                    console.log(req.session.id + " pushed to employee")
                }
            }

            res.send({response: result, status: true});
        }
    });
})

app.listen(port, () => {
    console.log(`Static server listens at http://localhost:${port}`);
})

app.get("/deleteClient/:nin", (req, res) => {
    const nin = req.params.nin;
    const sql_command = `DELETE FROM \`clients\` WHERE \`clients\`.\`nin\` = ${nin}`;

    sql.query(sql_command, (err, result, fields) => {
        if (err) throw err;
        console.log(`DELETE client (ID: ${nin})`);

        if (result.affectedRows == 0) {
            res.send({status: "404"});
        } else {
            res.send({status: "200 OK, DROP client"});
        }
    });
});

function checkPatientPermission(id) {
    for (let i = 0; i < sessionsStoraged.patients.length; i++) {
        if(sessionsStoraged.patients[i] == id) {
            return true;
        }
    }
    return false;
}

function checkDoctorPermission(id) {
    for (let i = 0; i < sessionsStoraged.doctors.length; i++) {
        if(sessionsStoraged.doctors[i] == id) {
            return true;
        }
    }
    return false;
}

function checkEmployeePermission(id) {
    for (let i = 0; i < sessionsStoraged.employees.length; i++) {
        if(sessionsStoraged.employees[i] == id) {
            return true;
        }
    }
    return false;
}