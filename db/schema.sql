-- clear prior database if exists, create new, and initialize --
DROP DATABASE IF EXISTS employeeTrackerDB;

CREATE DATABASE employeeTrackerDB;

USE employeeTrackerDB;

-- tables for tracking departments, role, and employee roster --
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    departmentId INT,
    FOREIGN KEY (departmentId) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first VARCHAR(30),
    last VARCHAR(30),
    managerId INT,
    roleId INT,
    FOREIGN KEY (managerId) REFERENCES employee(id),
    FOREIGN KEY (roleId) REFERENCES role(id)
);

