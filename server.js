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
    // console.log("Connnected to employee database");
    start();
});
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Delete Department",
                "Delete Roles",
                "Delete Employee",
                "View Employees By Department",
                "View Employees By Manager",
                "Update Employee Mangers",
                "Departments Utilized Budget",
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
                case "Delete Department":
                    deleteDepartment();
                    break;
                case "Delete Roles":
                    deleteRole();
                    break;
                case "Delete Employee":
                    deleteEmployee();
                    break;
                case "View Employees By Department":
                    viewBydept();
                    break;
                case "View Employees By Manager":
                    viewBymanager();
                    break;
                case "Update Employee Mangers":
                    updateManger();
                    break;
                case "Departments Utilized Budget":
                    departmentBudget();
                    break;
                case "Exit":
                    exitPrompt();
                    break;
            }
        });
}
function viewEmployee() {
    let qry =
        "SELECT employee.id,employee.first_name,employee.last_name, department.dept_name,roles.role_title,roles.salary,employee.manager_id  from roles JOIN employee on employee.role_id=roles.id JOIN department on department.id = roles.department_id ORDER BY employee.id";
    db.query(qry, function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    });
}
function viewRoles() {
    let qry =
        "SELECT roles.id AS RoleID,roles.role_title AS JOB_TITLE,department.dept_name AS Department_Name,roles.salary AS Salary from roles JOIN department ON roles.department_id=department.id ORDER BY roles.id";
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
function addEmployee() {
    var roleArray = [];
    var empArray = [];
    let qry = "select * from roles";
    db.query(qry, (err, results) => {
        if (err) throw err;
        let qry2 = "select * from employee";
        db.query(qry2, (err, results2) => {
            if (err) throw err;
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
                        name: "role",
                        type: "list",
                        message: "Enter your roleID",
                        choices: function () {
                            for (let i = 0; i < results.length; i++) {
                                roleArray.push(results[i].role_title);
                            }
                            return roleArray;
                        },
                    },
                    {
                        name: "managerid",
                        type: "list",
                        message: "Enter Manager id if there is a manager",
                        choices: function () {
                            for (let j = 0; j < results2.length; j++) {
                                empArray.push(results2[j].first_name);
                            }

                            return empArray;
                        },
                    },
                ])
                .then((answer) => {
                    let manager_id = empArray.indexOf(answer.managerid) + 1;
                    let roleid = roleArray.indexOf(answer.role) + 1;
                    let qry = "INSERT INTO employee(first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)";
                    db.query(qry, [answer.firstname, answer.lastname, roleid, manager_id], (err, results) => {
                        if (err) throw err;
                        console.log("NEW EMPLOYEE ADDED");
                        viewEmployee();
                    });
                });
        });
    });
}

function addRole() {
    var choiceArray = [];
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
                    message: "Enter the department name ",
                    choices: function () {
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].dept_name);
                        }
                        return choiceArray;
                    },
                },
            ])
            .then((answer) => {
                let departmentname = answer.dept;
                let deptid = choiceArray.indexOf(departmentname) + 1;
                // console.log(deptid);
                let qry = "INSERT INTO roles (role_title,salary,department_id) VALUES(?,?,?)";
                db.query(qry, [answer.roletitle, answer.rolesalary, deptid], (err, results) => {
                    if (err) throw err;
                    console.log("NEW ROLE ADDED");
                    //  console.table(results);
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
function updateEmployeerole() {
    let empnameArray = [];

    let qry = "SELECT * FROM employee";
    db.query(qry, (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "employeename",
                    type: "list",
                    message: "Select employee whose role is changing",
                    choices: function () {
                        for (let i = 0; i < results.length; i++) {
                            empnameArray.push(results[i].id + "." + results[i].first_name + " " + results[i].last_name);
                        }
                        return empnameArray;
                        // console.log(empnameArray);
                    },
                },
            ])
            .then((answer) => {
                let empid = empnameArray.indexOf(answer.employeename) + 1;
                console.log(empid);
                updateDetails(empid);
                // let newrole = answer.roletitle;
                // console.log(newrole);
            });
    });
}
function updateDetails(empid) {
    let roleArray2 = [];
    let qry2 = "select * from roles";
    db.query(qry2, (err, results2) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "roletitle",
                    type: "list",
                    message: "Select the new role ",
                    choices: function () {
                        for (let j = 0; j < results2.length; j++) {
                            roleArray2.push(results2[j].role_title);
                        }
                        return roleArray2;
                    },
                },
            ])
            .then((answer) => {
                let newrole = answer.roletitle;
                let roleid = roleArray2.indexOf(newrole) + 1;
                //console.log(newrole);
                //   console.log(roleid);
                let qry = "UPDATE employee SET role_id = ? WHERE employee.id=?";
                db.query(qry, [roleid, empid], (err, results) => {
                    if (err) throw err;
                    console.log("Employee Role Updated");
                    console.table(results);
                    viewEmployee();
                });
            });
    });
    // console.log(empid, "ID TO UPDATE");
}
function deleteDepartment() {
    let deptArray = [];
    let qry = "select * from department";
    db.query(qry, (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "dept",
                    type: "list",
                    message: "Select department to delete",
                    choices: function () {
                        for (let i = 0; i < results.length; i++) {
                            deptArray.push(results[i].dept_name);
                        }
                        return deptArray;
                    },
                },
            ])
            .then((answer) => {
                let deptid = deptArray.indexOf(answer.dept) + 1;
                console.log(deptid);
                let qry1 = "DELETE  FROM department WHERE id = ? ";
                db.query(qry1, [deptid], (err, results2) => {
                    if (err) throw err;
                    console.log("DEPARTMENT DELETED");

                    viewDepartment();
                });
            });
    });
}
function deleteRole() {
    inquirer
        .prompt({
            name: "role",
            type: "input",
            message: "Enter the roleID to delete",
        })
        .then((answer) => {
            console.log(answer.role);
            let qry1 = "DELETE FROM roles WHERE id=? ";
            db.query(qry1, answer.role, (err, results1) => {
                if (err) throw err;
                console.log("ROLE DELETED");
                viewRoles();
            });
        });
    // });
}
function deleteEmployee() {
    let empnameArray = [];

    let qry = "SELECT * FROM employee";
    db.query(qry, (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "employeename",
                    type: "list",
                    message: "Select employee whose role is changing",
                    choices: function () {
                        for (let i = 0; i < results.length; i++) {
                            empnameArray.push(results[i].id + "." + results[i].first_name + " " + results[i].last_name);
                        }
                        return empnameArray;
                        // console.log(empnameArray);
                    },
                },
            ])
            .then((answer) => {
                let empid = empnameArray.indexOf(answer.employeename) + 1;
                console.log(empid);
                let delqry = "DELETE FROM employee where id=?";
                db.query(delqry, empid, (err, results2) => {
                    if (err) throw err;
                    console.log("EMPLOYEE DELETED");
                    viewEmployee();
                });
            });
    });
}
function viewBydept() {
    let deptArray = [];
    let qry = "select * from department";
    db.query(qry, (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "deptname",
                    type: "list",
                    message: "Select the department ,to view its Employees",
                    choices: function () {
                        for (let i = 0; i < results.length; i++) {
                            deptArray.push(results[i].dept_name);
                        }
                        return deptArray;
                    },
                },
            ])
            .then((answer) => {
                let deptid = deptArray.indexOf(answer.deptname) + 1;
                console.log(deptid);
                let qry1 =
                    "Select employee.id,employee.first_name,employee.last_name,roles.salary,roles.role_title,department.dept_name from roles JOIN employee on employee.role_id=roles.id JOIN department on department.id=roles.department_id WHERE department.id=? ";
                db.query(qry1, deptid, (err, results2) => {
                    if (err) throw err;
                    console.table(results2);
                    start();
                });
            });
    });
}
function viewBymanager() {
    let managerArray = [];
    let qry = "SELECT * FROM employee Where manager_id >=0";
    db.query(qry, (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "manager",
                    type: "list",
                    message: "Select the manager",
                    choices: function () {
                        for (let i = 0; i < results.length; i++) {
                            managerArray.push(results[i].manager_id);
                        }
                        return managerArray;
                    },
                },
            ])
            .then((answer) => {
                let managerid = managerArray.indexOf(answer.manager) + 1;
                console.log(managerid);
                let qry1 = "SELECT first_name,last_name,manager_id from employee where manager_id=?";
                db.query(qry1, managerid, (err, results2) => {
                    if (err) throw err;
                    console.table(results2);
                    start();
                });
            });
    });
}
function updateManger() {
    console.log("Manager Update"); //to to
}
function departmentBudget() {
    let deptArray = [];
    let qry = "select * from department";
    db.query(qry, (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "deptname",
                    type: "list",
                    message: "Select the department ,to view its utilized budget",
                    choices: function () {
                        for (let i = 0; i < results.length; i++) {
                            deptArray.push(results[i].dept_name);
                        }
                        return deptArray;
                    },
                },
            ])
            .then((answer) => {
                let deptid = deptArray.indexOf(answer.deptname) + 1;
                let dept_name = answer.deptname;
                console.log(deptid);
                let qry2 = "Select  sum(salary) AS BUDGET from roles   WHERE department_id=?  ";
                // "SELECT department.dept_name,]]sum(roles.salary) AS Salary FROM roles JOIN department on roles.department_id=department.id  GROUP BY department.id=?";
                db.query(qry2, deptid, (err, results2) => {
                    if (err) throw err;
                    console.log(`The Budget Of ${dept_name}`);
                    console.table(results2);
                    start();
                });
            });
    });
}
function exitPrompt() {
    console.log("BYE.... use keys Control+c to exit ");
    // db.end(); //command to end connection
}
