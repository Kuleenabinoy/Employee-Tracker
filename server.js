const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "rootroot",
        database: "employee_db",
    },
    console.log("Connnected to employeedatabase")
);
db.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.log(results);
});
