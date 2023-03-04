
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
            viewAllRoles()
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