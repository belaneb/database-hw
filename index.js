const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'sys'
});

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'sys',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

let selectDepartmentSQL = "SELECT * FROM DEPARTMENT;"
let selectRoleSQL = "SELECT * FROM ROLE;"
let selectEmployeeSQL = "SELECT * FROM EMPLOYEE;"


function viewAllDepartments() {
    pool.query(
        selectDepartmentSQL,
        function (err, results, fields) {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.table(results)
        }
    );
}
function viewAllRoles() {
    pool.query(
        selectRoleSQL,
        function (err, results, fields) {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.table(results)
        }
    );

}
function viewAllEmployees() {
    pool.query(
        selectEmployeeSQL,
        function (err, results, fields) {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.table(results)
        }
    );

}

function insertDepartment(id, name) {
    pool.query(
        `INSERT INTO DEPARTMENT(id,name) value(${id}, '${name}')`,
        function (err, results, fields) {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log("Successfully Added!")
        }
    );
}
function insertRole(id, title, salary, departmentId) {
    pool.query(
        `INSERT INTO ROLE(id,title,salary,department_id) VALUE(${id}, '${title}', ${salary}, ${departmentId})`,
        function (err, results, fields) {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log("Successfully Added!")
        }
    );
}
function insertEmployee(id, firstName, lastName, roleId, managerId = null) {
    pool.query(
        `INSERT INTO EMPLOYEE(id,first_name,last_name,role_id,manager_id) VALUE(${id},'${firstName}', '${lastName}', ${roleId}, ${managerId});`,
        function (err, results, fields) {
            // console.log(err); // results contains rows returned by server
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            if(err){
                console.log("Error!")

            } else {
                console.log("Successfully Added!")

            }
        }
    );
}
function updateEmployee(id,roleId) {
    pool.query(
        `UPDATE EMPLOYEE SET role_id=${roleId} where id=${id} `,
        function (err, results, fields) {
            // console.log(err); // results contains rows returned by server
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            if(err){
                console.log("Error!")

            } else {
                console.log("Successfully Updated!")

            }
        }
    );
}


// viewAllDepartments()
// viewAllRoles()
// viewAllEmployees()

inquirer.prompt([
    {
        name: 'options',
        message: 'Select option?',
        type: 'list',
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
    }
]).then(function(answer){
    //console.log(answer)
    switch (answer.options) {
        case "view all departments":
            viewAllDepartments()
            break;
        case "view all roles":
            viewAllRoles()
            break;
        case "view all employees":
            viewAllEmployees()
            break;
        case "add a department":
            var id
            let name
            inquirer.prompt([
                {
                    name: 'departmentId',
                    message: 'Enter Department ID:',
                    type: 'input',
                },
                {
                    name: 'departmentName',
                    message: 'Enter Department Name:',
                    type: 'input',
                },
            ]).then(function(answer){
                id = answer.departmentId
                name = answer.departmentName
                insertDepartment(id, name)
            })
            break;
        case "add a role":
            inquirer.prompt([
                {
                    name: 'roleId',
                    message: 'Enter Role ID: ',
                    type: 'input',
                },
                {
                    name: 'roleTitle',
                    message: 'Enter Role Title: ',
                    type: 'input',
                },
                {
                    name: 'roleSalary',
                    message: 'Enter Salary: ',
                    type: 'input',
                },
                {
                    name: 'roleDepartmentId',
                    message: 'Enter Department ID: ',
                    type: 'input',
                },
                
            ]).then(function(answer){
                insertRole(answer.roleId,answer.roleTitle,answer.roleSalary,answer.roleDepartmentId)
            })
            break;
        case "add an employee":
            inquirer.prompt([
                {
                    name: 'employeeId',
                    message: 'Enter Employee ID: ',
                    type: 'input',
                },
                {
                    name: 'employeeFirstName',
                    message: 'Enter First Name: ',
                    type: 'input',
                },
                {
                    name: 'employeeLastName',
                    message: 'Enter Last Name: ',
                    type: 'input',
                },
                {
                    name: 'employeeRoleId',
                    message: 'Enter Role ID: ',
                    type: 'input',
                },
                {
                    name: 'managerId',
                    message: 'Enter Manager ID: ',
                    type: 'input',
                },
                
            ]).then(function(answer){
                insertEmployee(answer.employeeId, answer.employeeFirstName, answer.employeeLastName, answer.employeeRoleId, answer.managerId)
            })
            break;
        case "update an employee role":
            viewAllEmployees()
            inquirer.prompt([
                {
                    name: 'employeeEditId',
                    message: 'Enter Employee ID to edit: ',
                    type: 'input'
                },
                {
                    name: 'employeeEditRole',
                    message: 'Enter Employee new Role Id: ',
                    type: 'input'
                },
            ]).then(function(answer){
                updateEmployee(answer.employeeEditId, answer.employeeEditRole)
            })
            break;
    
        default:
            break;
    }
})