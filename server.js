
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const express = require('express');
const exp = require('constants');

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
    db.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function viewAllRoles() {
    db.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function viewAllEmployees() {
    db.query("SELECT employee.first, employee.last, role.title, role.salary, department.name, CONCAT(e.first, ' ', e.last) AS manager FROM employee INNER JOIN role ON role.id = employee.roleId INNER JOIN department ON department.id = role.departmentId LEFT JOIN employee e ON employee.managerId = e.id;",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function addDepartment() {
    db.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function addRole() {
    db.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function addEmployee() {
    db.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function updateEmployee() {
    db.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

