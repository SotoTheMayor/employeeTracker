
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
    inquirer.prompt([
        {
            type: "list",
            message: "How should employees be ordered",
            name: "order",
            choices: [
                "By departments",
                "By manager",
                "By ID"
            ]
        }
    ])
    .then(data => {
        if (data.order == "By departments") {
            db.query("SELECT employee.id AS 'ID', employee.first AS 'First Name', employee.last AS 'Last Name', role.title AS 'Job Title', department.name AS Department, role.salary AS Salary, CONCAT(boss.first, ' ', boss.last) AS Manager FROM employee JOIN role ON employee.roleID = role.id JOIN department ON role.departmentID = department.id LEFT JOIN employee boss ON employee.managerId = boss.roleId ORDER BY department.name;",
            function(err, results) {
                if (err) throw err;
                console.table(results);
                startPrompt()
            })
        } else if (data.order == "By manager") {
            db.query("SELECT employee.id AS 'ID', employee.first AS 'First Name', employee.last AS 'Last Name', role.title AS 'Job Title', department.name AS Department, role.salary AS Salary, CONCAT(boss.first, ' ', boss.last) AS Manager FROM employee JOIN role ON employee.roleID = role.id JOIN department ON role.departmentID = department.id LEFT JOIN employee boss ON employee.managerId = boss.roleId ORDER BY boss.roleId;",
            function(err, results) {
                if (err) throw err;
                console.table(results);
                startPrompt()
            })
        } else if (data.order == "By ID") {
            db.query("SELECT employee.id AS 'ID', employee.first AS 'First Name', employee.last AS 'Last Name', role.title AS 'Job Title', department.name AS Department, role.salary AS Salary, CONCAT(boss.first, ' ', boss.last) AS Manager FROM employee JOIN role ON employee.roleID = role.id JOIN department ON role.departmentID = department.id LEFT JOIN employee boss ON employee.managerId = boss.roleId ORDER BY employee.id;",
            function(err, results) {
                if (err) throw err;
                console.table(results);
                startPrompt()
            })
        }
    })
}

let roleArr = [];
function chooseRole() {
    db.query("SELECT * FROM role", function(err, result) {
        if (err) throw err;
        for (let i=0; i<result.length; i++) {
            roleArr.push(result[i].title)
        }
    })
    return roleArr;
}

function chooseDept() {
    let deptArr = [];
    db.query("SELECT * FROM department", function(err, result) {
        if (err) throw err;
        for (let i=0; i<result.length; i++) {
            deptArr.push(result[i].name)
        }
    })
    return deptArr;
}

let managerArr = [];
function chooseManager() {
    db.query("SELECT first, last FROM employee WHERE managerId is NULL", function(err, result) {
        if (err) throw err;
        for (let i=0; i<result.length; i++) {
            let x = concat(result[i].first + result[i].last);
            managerArr.push(x)
        }
    })
    return managerArr;
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the department name",
            name: "department",
        }
    ])
    .then(data => {
        addDept = {name: data.department};
        db.query("INSERT INTO department SET ?;", addDept,
        function(err, results) {
            if (err) throw err;
            console.log(`********Department '${data.department}' successfully added********`);
            startPrompt()
            })
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the role name?",
            name: "title"
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "salary"
        },
        {
            type: "list",
            message: "What department does this role belong to?",
            name: "department",
            choices: chooseDept()
        }
    ])
    .then(data => {
        let x;
        x = data.department.indexOf(data.department) + 1;
        addNew = { title: data.title, salary: data.salary, departmentId: x }
        db.query("INSERT INTO role SET ?;", addNew,
        function(err, results) {
            if (err) throw err;
            console.log(`********Role '${data.title}' successfully added*********`);
            startPrompt()
            })
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