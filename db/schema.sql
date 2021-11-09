DROP DATABASE IF EXISTS   employee_db;
CREATE DATABASE   employee_db;
USE  employee_db;
CREATE TABLE department (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   dept_name VARCHAR(30) 
);
CREATE TABLE roles  (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
role_title VARCHAR(30),
salary DECIMAL,
department_id INT,
FOREIGN KEY(department_id) REFERENCES department(id)
ON DELETE SET NULL
);
CREATE TABLE  employee  ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) ,
last_name VARCHAR(30) ,
role_id INT,
manager_id INT DEFAULT NULL,
FOREIGN KEY (role_id)
REFERENCES roles(id) 
ON DELETE SET NULL);

