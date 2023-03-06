
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employeeTrackerDB"
});

//connects to mysql and begins application
db.connect(function(err) {
    if (err) throw err;
    startPrompt()
});

//main menu and function
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
                "Delete a department, role, or employee",
                "View salary budget by department"
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
        } else if (data.choice == "Delete a department, role, or employee") {
            deleteItems()
        } else if (data.choice == "View salary budget by department") {
            budget()
        }
    })
}

//called when View All Departments is selected from main menu
function viewAllDepartments() {
    db.query("SELECT department.name AS 'Department Name', department.id AS 'Department ID' FROM department",
    function(err, results) {
        if (err) throw err;
        console.table(results);
        startPrompt()
    })
}

//called when View All Roles is selected from main menu
function viewAllRoles() {
    db.query("SELECT title AS 'Job Title', role.id AS 'Role ID', name AS Department, salary AS Salary FROM role LEFT JOIN department ON role.departmentId = department.id",
    function(err, results) {
        if (err) throw err;
        console.table(results);
        startPrompt()
    })
}

//called with View All Employees is selected from main menu
function viewAllEmployees() {
    //provides an employee sorting option
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
        //sorts data based on option selected
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

//function for creating an array of Roles to call later when creating an employee
let roleArr = [];
function chooseRole() {
    db.query("SELECT * FROM role", function(err, result) {
        if (err) throw err;
        for (var i=0; i<result.length; i++) {
            roleArr.push(result[i].title)
        }
    })
    return roleArr;
}

//function for creating an array of Departments to call later when creating a role
let deptArr = [];
function chooseDept() {
    db.query("SELECT * FROM department", function(err, result) {
        if (err) throw err;
        for (var i=0; i<result.length; i++) {
            deptArr.push(result[i].name)
        }
    })
    return deptArr;
}

//function for creating an array of Managers to call later when creating an employee
let managerArr = [];
function chooseManager() {
    db.query("SELECT first, last FROM employee WHERE managerId IS NULL", function(err, result) {
        if (err) throw err;
        for (var i=0; i<result.length; i++) {
            var x = result[i].first + " " + result[i].last;
            managerArr.push(x)
        }
        managerArr.push("null")
    })
    return managerArr;
}

//function for creating an array of Employees to call later when updating an employee
let employeeArr = [];
function chooseEmployee() {
    db.query("SELECT * FROM employee", function(err, result) {
        if (err) throw err;
        for (var i=0; i<result.length; i++) {
            var x = result[i].first + " " + result[i].last;
            employeeArr.push(x)
        }
    })
    return employeeArr;
}

//called when Add a Department is selected from the main menu
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

//called when Add a Role is selected from the main menu
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
        //pairs chosen dept to array index number for setting departmentId
        var x = chooseDept().indexOf(data.department) + 1;
        addNew = { title: data.title, salary: data.salary, departmentId: x }
        db.query("INSERT INTO role SET ?;", addNew,
        function(err, results) {
            if (err) throw err;
            console.log(`********Role '${data.title}' successfully added*********`);
            startPrompt()
            })
    })
}

//called when Add an Employee is selected from the main menu
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "first"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "last"
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "role",
            choices: chooseRole()
        },
        {
            type: "list",
            message: "Who is the employee's manager (choose 'null' for department leader)?",
            name: "manager",
            choices: chooseManager()
        }
    ])
    .then(data => {
        //pairs chosen manager and role to respective array index number for setting IDs
        var x = chooseManager().indexOf(data.manager) + 1;
        var y = chooseRole().indexOf(data.role) + 1;
        if (data.manager == 'null') {
            x = null
        }
        addNew = { first: data.first, last: data.last, managerId: x, roleId: y }
        db.query("INSERT INTO employee SET ?;", addNew,
        function(err, results) {
            if (err) throw err;
            console.log(`********Employee '${data.first} ${data.last}' successfully added*********`);
            startPrompt()
            })
    })
}

//called when Update an Employee is selected from the main menu
function updateEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "pause",
            message: "Press Enter"
        },
        {
            type: "list",
            message: "Which employee would you like to update?",
            name: "employee",
            choices: chooseEmployee()
        },
        {
            type: "list",
            message: "What is the employee's updated role?",
            name: "role",
            choices: chooseRole()
        }
    ])
    .then(data => {
        //pairs chosen manager and role to respective array index number for setting IDs
        var x = chooseEmployee().indexOf(data.employee) + 1;
        var y = chooseRole().indexOf(data.role) + 1;
        var updatedEmployee = [y, x]
        db.query(`UPDATE employee SET roleId=? WHERE id=?;`, updatedEmployee,
        function(err, results) {
            if (err) throw err;
            console.log(`********Employee ${x} successfully updated*********`);
            startPrompt()
            })
    })
}

//called when Delete is selected from main menu
function deleteItems() {
    inquirer.prompt([
        {
            type: "list",
            message: "Which would you like to delete?",
            name: "delete",
            choices: [
                "Department",
                "Role",
                "Employee",
                "Return"
            ]
        }
    ])
    .then(data => {
        if (data.delete == "Department") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "pause",
                    message: "Press Enter"
                },
                {
                    type: "list",
                    message: "Which department would you like to delete?",
                    name: "deleteDept",
                    choices: chooseDept()
                }
            ]).then(data => {
                //disables keys to allow delete
                db.query('SET FOREIGN_KEY_CHECKS=0',
                function(err, results){
                    if (err) throw err
                })
                var x = chooseDept().indexOf(data.deleteDept) + 1;
                db.query(`DELETE FROM department WHERE department.id=${x};`,
                function(err, results) {
                    if (err) throw err;
                    console.table(results);
                    startPrompt()
                })
                //reenables keys
                db.query('SET FOREIGN_KEY_CHECKS=1',
                function(err, results){
                    if (err) throw err
                })
            })
        } else if (data.delete == "Role") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "pause",
                    message: "Press Enter"
                },
                {
                    type: "list",
                    message: "Which role would you like to delete?",
                    name: "deleteRole",
                    choices: chooseRole()
                }
            ]).then(data => {
                //disables keys to allow delete
                db.query('SET FOREIGN_KEY_CHECKS=0',
                function(err, results){
                    if (err) throw err
                })
                var x = chooseRole().indexOf(data.deleteRole) + 1;
                db.query(`DELETE FROM role WHERE role.id=${x};`,
                function(err, results) {
                    if (err) throw err;
                    console.table(results);
                    startPrompt()
                })
                //reenables keys
                db.query('SET FOREIGN_KEY_CHECKS=1',
                function(err, results){
                    if (err) throw err
                })
            })
        } else if (data.delete == "Employee") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "pause",
                    message: "Press Enter"
                },
                {
                    type: "list",
                    message: "Which employee would you like to delete?",
                    name: "deleteEE",
                    choices: chooseEmployee()
                }
            ]).then(data => {
                //disables keys to allow delete
                db.query('SET FOREIGN_KEY_CHECKS=0',
                function(err, results){
                    if (err) throw err
                })
                var x = chooseEmployee().indexOf(data.deleteEE) + 1;
                db.query(`DELETE FROM employee WHERE employee.id=${x};`,
                function(err, results) {
                    if (err) throw err;
                    console.table(results);
                    startPrompt()
                })
                //reenables keys
                db.query('SET FOREIGN_KEY_CHECKS=1',
                function(err, results){
                    if (err) throw err
                })
            })
        } else if (data.delete == "Return") {
            startPrompt()
        }
    })
}

//look up department based on selection
//look up roles within the selected department
//look up all employees with those roles
//add all salaries of all employees with those roles together

// function budget() {
//     inquirer.prompt([
//         {
//             type: "input",
//             name: "pause",
//             message: "Press Enter"
//         },
//         {
//             type: "list",
//             message: "Which department's salary budget would you like to view?",
//             name: "budget",
//             choices: chooseDept()
//         }
//     ]).then(data => {
//         if (data.budget) {
//             var x = chooseDept().indexOf(data.budget) + 1;
//             db.query(`SELECT * FROM role WHERE role.departmentId=${x}`, function(err, result) {
//                 if (err) throw err;
//                 for (var i=0; i<result.length; i++) {
//                     deptArr.push(result[i].name)
//                 }
//             })
//             db.query(`SELECT * FROM employee WHERE employee.roleId=${data.budget}`, function(err, result) {
//                 if (err) throw err;
//                 for (var i=0; i<result.length; i++) {
//                     deptArr.push(result[i].name)
//                 }
//             })

//         }
//     })
// }

