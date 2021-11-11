-- SELECT employee.id,employee.first_name,employee.last_name,
-- department.dept_name,
--      roles.role_title,roles.salary,employee.manager_id 
--     from roles JOIN employee on employee.role_id=roles.id JOIN department on department.id = roles.department_id 
--      ORDER BY employee.first_name ;
    

--     SELECT roles.id AS RoleID,roles.role_title AS JOB_TITLE,department.dept_name AS Department_Name,
--     roles.salary AS Salary from roles JOIN department ON 
--     roles.department_id=department.id;