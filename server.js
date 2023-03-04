
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table')

const connection = mysql.createConnection({
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
                "Add Employee",
                "Add role",
                "Add department"
            ]
        }
    ])
}