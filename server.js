
const inquirer = require('inquirer');
const db = require('mysql2');
const cTable = require('console.table')

const connection = db.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "password",
    database: "employeeTrackerDB"
});

connection.connect(function(err) {
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
                "View all employees",
                "View all employees by role",
                "View all employees by department",
                "Add employee",
                "Update employee",
                "Add role",
                "Add department"
            ]
        }
    ])
    .then(data => {
        if (data.choice == "View all employees") {
            viewAllEmployees()
        } else if (data.choice == "View all employees by role") {
            viewAllRole()
        } else if (data.choice == "View all employees by department") {
            viewAllDepartment()
        } else if (data.choice == "Add employee") {
            addEmployee()
        } else if (data.choice == "Update employee") {
            updateEmployee()
        } else if (data.choice == "Add role") {
            addRole()
        } else if (data.choice == "Add department") {
            addDepartment()
        }
    })
}

function viewAllEmployees() {
    connection.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function viewAllRole() {
    connection.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function viewAllDepartment() {
    connection.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function addEmployee() {
    connection.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function updateEmployee() {
    connection.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function addRole() {
    connection.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}

function addDepartment() {
    connection.query("",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt()
    })
}