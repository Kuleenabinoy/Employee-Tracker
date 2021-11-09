DROP DATABASE IF EXISTS   employee_db    ;
CREATE DATABASE   employee_db            ;
USE      employee_db            ;
CREATE TABLE department  (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   dept_name VARCHAR(30) NOT NULL,
);
CREATE TABLE role  (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
role_title VARCHAR(30),
salary DECIMAL(10,2),
department_id INT,
FOREIGN KEY(department_id)
REFERENCES department(id)
ON DELETE SET NULL
);
CREATE TABLE  employee   ( id INT NOT NULL AUTO_INCREMENT PRIMARY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_id INT DEFAULT NULL,
FOREIGN KEY (role_id)
REFERENCES role(id) 
ON DELETE SET NULL);

