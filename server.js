const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "employee_db",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connnected to employee database");
    start();
});
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View all Departments":
                    viewDepartment();
                    break;
                case "View all Employees":
                    viewEmployee();
                    break;
                case "View all Roles":
                    viewRoles();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Update Employee Role":
                    updateEmployeerole();
                    break;
                case "Exit":
                    exitPrompt();
                    break;
            }
        });
}
function viewEmployee() {
    let qry =
        "SELECT employee.id,employee.first_name,employee.last_name, department.dept_name,roles.role_title,roles.salary,employee.manager_id  from roles JOIN employee on employee.role_id=roles.id JOIN department on department.id = roles.department_id ORDER BY employee.first_name ";
    db.query(qry, function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    });
}
function viewRoles() {
    let qry =
        "SELECT roles.id AS RoleID,roles.role_title AS JOB_TITLE,department.dept_name AS Department_Name,roles.salary AS Salary from roles JOIN department ON roles.department_id=department.id";
    db.query(qry, function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    });
}
function viewDepartment() {
    let qry = "SELECT * FROM department";
    db.query(qry, (err, results) => {
        if (err) throw err;
        console.table(results);
        // console.log(results.length);
        start();
    });
}
// let deptArray = [];
// function deptSelection() {
//     let qry = "SELECT * FROM department";
//     db.query =
//         (qry,
//         (err, results) => {
//             let length = results.length;
//             if (err) throw err;
//             for (let i = 0; i < length; i++) {
//                 deptArray.push(results[i].dept_name);
//             }
//             console.table(results);
//         });
//     return deptArray;
//     //  console.log(deptArray);
// }
// const department = deptSelection();
// console.log(department, "DEPARTMENT");
//function roleSelection() {}
//function managerSelection() {}
function addEmployee() {
    inquirer
        .prompt([
            {
                name: "firstname",
                type: "input",
                message: "Enter the first name of employee",
            },
            {
                name: "lastname",
                type: "input",
                message: "Enter the last name of employee",
            },
            {
                name: "roleid",
                type: "input",
                message: "Enter your roleID",
            },
            {
                name: "managerid",
                type: "input",
                message: "Enter Manager id if there is a manager",
            },
        ])
        .then((answer) => {
            let qry = "INSERT INTO employee(first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)";
            db.query(qry, [answer.firstname, answer.lastname, answer.roleid, answer.managerid], (err, results) => {
                if (err) throw err;
                console.log("NEW EMPLOYEE ADDED");
                viewEmployee();
            });
        });
}

function addRole() {
    db.query("select * from department", (err, results) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "roletitle",
                    type: "input",
                    message: "Enter the role title",
                },
                {
                    name: "rolesalary",
                    type: "input",
                    message: "Enter role salary",
                },
                {
                    name: "dept",
                    type: "list",
                    message: "Enter the depatment name ",
                    choices: function () {
                        var choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].dept_name);
                        }
                        return choiceArray;
                    },
                },
            ])
            .then((answer) => {
                let departmentname = answer.dept;
                console.log(departmentname);
                let deptid = choiceArray.indexof(departmentname);
                console.log(deptid);

                let qry = "INSERT INTO roles (role_title,salary,department_id) VALUES(?,?,?)";
                db.query(qry, [answer.roletitle, answer.rolesalary, deptid], (err, results) => {
                    if (err) throw err;
                    console.log("NEW ROLE ADDED");
                    console.table(results);
                    viewRoles();
                });
            });
    });
}
function addDepartment() {
    inquirer
        .prompt({
            name: "departmentname",
            type: "input",
            message: "Enter the new department",
        })
        .then((answer) => {
            let qry = "INSERT INTO department (dept_name) VALUES (?)";
            db.query(qry, answer.departmentname, (err, results) => {
                if (err) throw err;
                console.log("NEW DEPARTMENT ADDED ");
                // console.table(results);
                viewDepartment();
            });
        });
}
function updateEmployeerole() {}
function exitPrompt() {
    console.log("sucess");
}
