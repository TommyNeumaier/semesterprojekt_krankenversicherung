const port = 3000;
const express = require("express");
const app = express();

app.use(express.static("test"));

app.listen(port, () => {
    console.log(`Test static server listens at http://localhost:${port}`);
})