const port = 3000;
const express = require("express");
const app = express();
let session = require("express-session");
let cookieParser = require("cookie-parser");

let sessionsStoraged = {
    patients: [], doctors: [], employees: []
};

app.use(cookieParser());
app.use(express.json());
app.use(session({
    secret: 'secret', resave: false, saveUninitialized: true
}));

const mysql = require("mysql");

let sql = mysql.createConnection({
    host: "sql.tommyneumaier.at", user: "medt", password: "tOKvR53i2j48HuhI", database: "medt"
});

sql.connect((err) => {
    if (err) throw err;
    console.log("Connected");
});

app.use("/", express.static("public"));

app.get("/auth/:category", (req, res) => {
    let status;
    switch (req.params.category) {
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
        if (result.length == 0) res.send({status: false}); else {
            if (result[0].patient == 1) {
                if (!checkPatientPermission(req.session.id)) {
                    sessionsStoraged.patients.push(req.session.id);
                    console.log(req.session.id + " pushed to patient")
                }
            }

            if (result[0].doctor == 1) {
                if (!checkDoctorPermission(req.session.id)) {
                    sessionsStoraged.doctors.push(req.session.id);
                    console.log(req.session.id + " pushed to doctor")
                }
            }

            if (result[0].employee == 1) {
                if (!checkEmployeePermission(req.session.id)) {
                    sessionsStoraged.employees.push(req.session.id);
                    console.log(req.session.id + " pushed to employee")
                }
            }

            res.send({response: result, status: true});
        }
    });
})

app.get("/getClientViaID/:id", (req, res) => {
    const id = req.params.id;
    if (checkEmployeePermission(req.session.id)) {
        const sql_command = `SELECT * FROM \`users\` WHERE \`id\` = ${id}`;
        sql.query(sql_command, (err, results, fields) => {
            if (err) throw err;
            res.send(results);
        });
    } else {
        res.sendStatus(403);
    }
})

app.get("/getAllAccounts", (req, res) => {
    if (checkEmployeePermission(req.session.id)) {
        const sql_command = `SELECT * FROM users`;
        sql.query(sql_command, (err, results, fields) => {
            if (err) throw err;
            res.send(results);
        });
    } else {
        res.sendStatus(403);
    }
})

app.post("/addUser", (req, res) => {
    if (checkEmployeePermission(req.session.id)) {
        const sql_command = `INSERT INTO \`users\` (\`first_name\`, \`middle_name\`, \`title\`, \`last_name\`, \`birthday\`, \`address\`, \`phone_number\`, \`postial_code\`, \`city\`, \`district\`, \`mail\`, \`state\`, \`password\`, \`nin\`, \`patient\`, \`doctor\`, \`employee\`) VALUES ('${req.body.first_name}', '${req.body.middle_name}', '${req.body.title}', '${req.body.last_name}', '${req.body.birthday}', '${req.body.address}', '${req.body.phone}', '${req.body.postial_code}', '${req.body.city}', '${req.body.district}', '${req.body.mail}', '${req.body.state}', '${req.body.id}', '${req.body.nin}', '1', '${req.body.isDoctor}', '${req.body.isEmployee}');`
        sql.query(sql_command, (err, results, fields) => {
            if (err) throw err;
            res.send({status: true})
        })
    } else {
        res.sendStatus(403);
    }
});

app.listen(port, () => {
    console.log(`Static server listens at http://localhost:${port}`);
})

app.post("/editClient/:id", (req, res) => {
    if (checkEmployeePermission(req.session.id)) {
        const id = req.params.id;
        const sql_command = `UPDATE \`users\` SET \`first_name\` = '${req.body.first_name}', \`middle_name\` = '${req.body.middle_name}', \`last_name\` = '${req.body.last_name}', \`birthday\` = '${req.body.birthday}', \`address\` = '${req.body.address}', \`phone_number\` = '${req.body.phone}', \`postial_code\` = '${req.body.postial_code}', \`city\` = '${req.body.city}', \`district\` = '${req.body.district}', \`mail\` = '${req.body.mail}', \`state\` = '${req.body.state}', \`sex\` = '${req.body.sex}', \`doctor\` = '${req.body.isDoctor}', \`employee\` = '${req.body.isEmployee}' WHERE \`users\`.\`id\` = ${id}]; `;
        sql.query(sql_command, (err, results, fields) => {
            if (err) throw err;
            res.send(results);
        })
    } else {
        res.sendStatus(403);
    }
})

app.get("/deleteClient/:id", (req, res) => {
    if (checkEmployeePermission(req.session.id)) {
        const id = req.params.id;
        const sql_command = `DELETE FROM \`users\` WHERE \`users\`.\`id\` = ${id}`;

        sql.query(sql_command, (err, result, fields) => {
            if (err) throw err;
            console.log(`DELETE client (ID: ${id})`);

            if (result.affectedRows == 0) {
                res.send({status: "404"});
            } else {
                res.send({status: "200 OK, DROP client"});
            }
        });
    } else {
        res.sendStatus(403);
    }
});

function checkPatientPermission(id) {
    for (let i = 0; i < sessionsStoraged.patients.length; i++) {
        if (sessionsStoraged.patients[i] == id) {
            return true;
        }
    }
    return false;
}

function checkDoctorPermission(id) {
    for (let i = 0; i < sessionsStoraged.doctors.length; i++) {
        if (sessionsStoraged.doctors[i] == id) {
            return true;
        }
    }
    return false;
}

function checkEmployeePermission(id) {
    for (let i = 0; i < sessionsStoraged.employees.length; i++) {
        if (sessionsStoraged.employees[i] == id) {
            return true;
        }
    }
    return false;
}