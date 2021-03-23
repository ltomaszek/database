-- employes with salary greater than the salary of employee 110
SELECT  * 
FROM    employees
WHERE   salary >   (SELECT salary 
                    FROM employees 
                    WHERE employee_id = 110);

-- or
SELECT  * 
FROM    employees e1
JOIN    employees e2
    ON  e2.salary > e1.salary
WHERE   e1.employee_id = 110;

-- define employee variable
DEFINE employee = "(select * from employees where employee_id = 145)";

-- all employees that work in the same departmant as 'defined employee'
SELECT *
FROM   employees
WHERE  department_id = (
                        SELECT department_id 
                        FROM   &employee);

-- all employees that work in the same departmant as 'defined employee'
-- and earn less
SELECT  first_name,
        last_name,
        department_id,
        salary,
        (SELECT salary FROM &employee) AS compared_salary
FROM    employees
WHERE   department_id = (SELECT department_id 
                         FROM   &employee)
        AND salary <    (SELECT salary
                         FROM   &employee);
         
-- first hired employee                
SELECT  *
FROM    employees
WHERE   hire_date = (SELECT MIN(hire_date) 
                    FROM employees) ;

-- most recently hired employee
SELECT  *
FROM    employees
WHERE   hire_date = (SELECT MAX(hire_date)
                     FROM employees);
     
-- best paid employees by department
SELECT  employee_id,
        first_name,
        last_name,
        department_id,
        salary
FROM    employees e
NATURAL JOIN (SELECT   department_id,
                       MAX(salary) AS max_salary
             FROM      employees
             GROUP BY  department_id) t
WHERE   e.salary = t.max_salary
ORDER BY salary DESC;

-- or
SELECT  employee_id,
        first_name,
        last_name,
        department_id,
        salary
FROM    employees
WHERE   (department_id, salary) IN
                                (SELECT department_id, MAX(salary)
                                 FROM   employees
                                 GROUP BY department_id)
ORDER BY salary DESC;

-- or
SELECT  employee_id,
        first_name,
        last_name,
        department_id,
        salary
FROM    employees a
WHERE   salary = (SELECT MAX(salary)
                  FROM   employees b
                  WHERE  b.department_id = a.department_id)
ORDER BY salary DESC;

-- employess that earn more than the least paid sales manager
SELECT  *
FROM    employees
WHERE   salary > ANY (SELECT   salary
                      FROM     employees
                      WHERE    job_id = 'SA_MAN');
                      
-- or
SELECT  *
FROM    employees
WHERE   salary > (SELECT   MIN(salary)
                  FROM     employees
                  WHERE    job_id = 'SA_MAN');

-- employess that earn more than all sales manager
SELECT  *
FROM    employees
WHERE   salary > ALL (SELECT   salary
                      FROM     employees
                      WHERE    job_id = 'SA_MAN');

-- or
SELECT  *
FROM    employees
WHERE   salary > (SELECT   MAX(salary)
                  FROM     employees
                  WHERE    job_id = 'SA_MAN');

-- employess that are located in United Kingdom
SELECT      e.employee_id,
            e.first_name,
            e.last_name,
            c.country_name
FROM        employees e
JOIN        departments d
    USING   (department_id)
JOIN        locations l
    USING   (location_id)
JOIN        countries c
    USING   (country_id)
WHERE 	    c.country_name = 'United Kingdom'
ORDER BY    e.last_name, e.first_name;

-- or
SELECT  employee_id,
        first_name,
        last_name
FROM    employees
WHERE   department_id IN 
                        (SELECT  department_id
                         FROM    departments
                         WHERE   location_id IN
                                            (SELECT  location_id
                                             FROM    locations
                                             WHERE   country_id IN 
                                                                (SELECT country_id
                                                                 FROM countries
                                                                 WHERE country_name = 'United Kingdom')))
ORDER BY last_name, first_name;

-- people who work in the same department as epmployys 103,105,110
-- and earn the same amout
SELECT  employee_id,
        first_name,
        last_name,
        department_id,
        salary
FROM    employees
WHERE   (department_id, salary) IN
                                    (SELECT department_id, salary
                                     FROM   employees
                                     WHERE employee_id IN (103,105,110))
AND     employee_id NOT IN (103, 105, 110);

-- employees that reached the max salary for their position
SELECT  employee_id,
        first_name,
        last_name,
        department_id,
        salary,
        max_salary
FROM    employees e
JOIN    jobs j 
    USING (job_id)
WHERE   e.salary = j.max_salary;

-- or
SELECT  employee_id,
        first_name,
        last_name,
        department_id,
        salary
FROM    employees 
WHERE   (job_id, salary) IN
                        (SELECT job_id, max_salary
                         FROM   jobs);

-- employees who earn more than the company's average salary
SELECT  first_name,
        last_name,
        salary
FROM    employees
WHERE   salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary;

-- employees who earn less than the department's average salary
SELECT  employee_id,
        first_name,
        last_name,
        department_id,
        salary,
        (SELECT ROUND(AVG(salary))
         FROM   employees b
         WHERE  b.department_id = a.department_id) AS "DEPARTMENT'S AVERAGE SALARY"
FROM    employees a
WHERE   salary < (SELECT AVG(salary)
                  FROM   employees b
                  WHERE  b.department_id = a.department_id)
ORDER BY department_id, salary;

-- or
SELECT  e.employee_id,
        e.first_name,
        e.last_name,
        e.department_id,
        e.salary,
        (SELECT ROUND(AVG(salary))
         FROM employees b
         WHERE b.department_id = e.department_id)
FROM    employees e
JOIN    (SELECT department_id, AVG(salary) AS avg_salary
         FROM   employees
         GROUP BY department_id) j
ON      e.department_id = j.department_id
WHERE   e.salary < j.avg_salary
ORDER BY department_id, salary;

-- people who work in the same department as Luis
SELECT  first_name,
        last_name,
        department_id
FROM    employees
WHERE   department_id = (SELECT department_id
                         FROM   employees
                         WHERE  UPPER(first_name) = 'LUIS');

-- people who work in San Francisco
SELECT      e.first_name,
            e.last_name,
            l.city
FROM        employees e
JOIN        departments d
    USING   (department_id)
JOIN        locations l
    USING   (location_id)
WHERE       UPPER(l.city) LIKE '%SAN FRANCISCO%';

-- people who work in San Francisco | Other
SELECT      e.first_name,
            e.last_name,
            (CASE location_id
                WHEN  (SELECT  location_id 
                                    FROM    locations 
                                    WHERE   city 
                                    LIKE '%San Francisco%') THEN 'San Francisco'
                ELSE 'Other'
            END) AS city
FROM        employees e
LEFT JOIN   departments d
    USING   (department_id)
ORDER BY    city DESC;

-- OR
SELECT      e.first_name,
            e.last_name,
            (CASE 
                WHEN l.city LIKE '%San Francisco%' THEN 'San Francisco'
                ELSE 'Other'
            END) AS city
FROM        employees e
LEFT JOIN   departments d
    USING   (department_id)
LEFT JOIN   locations l
    USING   (location_id)
ORDER BY    l.city DESC;
