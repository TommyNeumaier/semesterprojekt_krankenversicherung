const port = 4000;
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

app.use(cors());
app.use(express.json());

let sql = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "lwSHfCYO0V0q5j)v",
    database: "medt"
});

sql.connect((err) => {
    if (err) throw err;
    console.log("Connected");
});

app.get("/getClients", (req, res) => {
    sql.query("SELECT * FROM `clients`", (err, result, fields) => {
        if (err) throw err;
        console.log("GET clients");
        res.send(result);
    });
});

app.get("/getClientById/:id/:mail/:password", (req, res) => {
    const id = req.params.id;
    const sql_command = `SELECT * FROM \`clients\` WHERE \`id\` = ${id}`;

    sql.query(sql_command, (err, result, fields) => {
        if (err) throw err;
        console.log("GET client via ID");

        if (result.length == 0) {
            res.send({status: "404 Client not found"});
        } else {
            res.send(result);
        }
    });
});

app.get("/searchClients/:filter/:search", (req, res) => {
    const filter = req.params.filter;
    const searchText = req.params.search;
    const sql_command = `SELECT * FROM \`clients\` WHERE \`${filter}\` LIKE '%${searchText}%' `;

    sql.query(sql_command, (err, result, fields) => {
        if (err) throw err;
        console.log(`SEARCH clients (${filter}, ${searchText})`);

        if (result.length == 0) {
            res.send({status: "404 Client not found"});
        } else {
            res.send(result);
        }
    });
});

app.get("/deleteClient/:id", (req, res) => {
    const id = req.params.id;
    const sql_command = `DELETE FROM \`clients\` WHERE \`clients\`.\`id\` = ${id}`;

    sql.query(sql_command, (err, result, fields) => {
        if (err) throw err;
        console.log(`DELETE client (ID: ${id})`);

        if (result.affectedRows == 0) {
            res.send({status: "404"});
        } else {
            res.send({status: "200 OK, DROP client"});
        }
    });
});

app.post("/addClient", (req, res) => {
    let answer = req.body;
    const sql_command = `INSERT INTO \`clients\` (\`id\`, \`firstname\`, \`lastname\`, \`birthday\`, \`address\`, \`state\`, \`country\`, \`phone\`, \`mail\`, \`insurance_type\`, \`role\`) VALUES (NULL, '${answer.firstname}', '${answer.lastname}', '${answer.birthday}', '${answer.address}', '${answer.state}', '${answer.country}', '${answer.phone}', '${answer.mail}', '${answer.insurance_type}', '${answer.role}');`

    sql.query(sql_command, (err, result, fields) => {
        if (err) throw err;
        console.log("ADD client");
        res.send({status: `${answer.firstname} ${answer.lastname} was successfully added to the database.`});
    });
});

app.post("/editClient", (req, res) => {
    let answer = req.body;
    console.log(answer);
    let sql_command = `UPDATE \`clients\` SET \`firstname\` = '${answer.firstname}', \`lastname\` = '${answer.lastname}', \`birthday\` = '${answer.birthday}', \`address\` = '${answer.address}', \`state\` = '${answer.state}', \`country\` = '${answer.country}', \`phone\` = '${answer.phone}', \`mail\` = '${answer.mail}', \`insurance_type\` = '${answer.insurance_type}', \`role\` = 'P', \`username\` = 'LEER' WHERE \`clients\`.\`id\` = ${answer.id};`;

    sql.query(sql_command, (err, result, fields) => {
        if (err) throw err;
        console.log("EDIT client");
        res.send({status: `${answer.firstname} ${answer.lastname} was successfully edited.`});
    });
});

app.get("/login/:mail/:password", (req, res) => {
    const mail = req.params.mail;
    const password = req.params.password;
    const sql_command = `SELECT * FROM \`clients\` WHERE \`mail\` = '${mail}' AND \`password\` = '${password}'`;

    sql.query(sql_command, (err, result, fields) => {
        if (err) throw err;
        const loginOk = result.length == 1 ? true : false;
        res.send({result: result, loginOk: loginOk})
    })
})

app.listen(port, () => {
    console.log(`Database server listens on ${port}`);
    console.log(`phpMyAdmin: http://localhost/phpMyAdmin`);
});