const port = 5000;
const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/getHTMLTemplate/:mail/:password/:template", (req, res) => {
    const mail = req.params.mail;
    const password = req.params.password;
    const template = req.params.template;

    fs.readFile(`./html_templates/${template}.txt`, 'utf-8', (err, result) => {
        if (err) throw err;
        console.log(result)
        res.send({result: result});
    })
})

app.listen(port, () => {
    console.log(`Template loader listens at Port ${port}`)
})