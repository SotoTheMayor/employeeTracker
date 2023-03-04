
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employeeTrackerDB"
});

db.connect(function(err) {
    if (err) throw err;
    startPrompt()
});

function startPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
            ]
        }
    ])
    .then(data => {
        if (data.choice == "View all departments") {
            viewAllDepartments()
        } else if (data.choice == "View all roles") {
            viewAllRoles()
        } else if (data.choice == "View all employees") {
            viewAllEmployees()
        } else if (data.choice == "Add a department") {
            addDepartment()
        } else if (data.choice == "Add a role") {
            addRole()
        } else if (data.choice == "Add an employee") {
            addEmployee()
        } else if (data.choice == "Update an employee role") {
            updateEmployee()
        }
    })
}

function viewAllDepartments() {
    db.query("SELECT department.name AS 'Department Name', department.id AS 'Department ID' FROM department",
    function(err, results) {
        if (err) throw err;
        console.table(results);
        startPrompt()
    })
}

function viewAllRoles() {
    db.query("SELECT title AS 'Job Title', role.id AS 'Role ID', name AS Department, salary AS Salary FROM role LEFT JOIN department ON role.departmentId = department.id",
    function(err, results) {
        if (err) throw err;
        console.table(results);
        startPrompt()
    })
}

function viewAllEmployees() {
    db.query("SELECT employee.first AS 'First Name', employee.last AS 'Last Name', role.title AS Role, role.salary AS Salary, department.name AS Department, CONCAT(boss.first, ' ', boss.last) AS Manager FROM employee JOIN role ON employee.roleID = role.id JOIN department ON role.departmentID = department.id LEFT JOIN employee boss ON employee.managerId = boss.roleId;",
    function(err, results) {
        if (err) throw err;
        console.table(results);
        startPrompt()
    })
}

function addDepartment() {
    db.query("",
    function(err, results) {
        if (err) throw err;
        console.table(results);
        startPrompt()
    })
}

function addRole() {
    db.query("",
    function(err, results) {
        if (err) throw err;
        console.table(results);
        startPrompt()
    })
}

function addEmployee() {
    db.query("",
    function(err, results) {
        if (err) throw err;
        console.table(results);
        startPrompt()
    })
}

function updateEmployee() {
    db.query("",
    function(err, results) {
        if (err) throw err;
        console.table(results);
        startPrompt()
    })
}

app.use((req, results) => {
    results.status(404).end()
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});