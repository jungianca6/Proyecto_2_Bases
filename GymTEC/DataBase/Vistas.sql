----------- Empleado con salario y planilla -----------
CREATE OR REPLACE VIEW payroll_view AS
SELECT
    e.employee_id,
    e.name AS employee_name,
    p.name AS position_name,
    s.spreadsheet_id,
    s.hourly_rate
FROM Employee e
JOIN Position p ON e.position_id = p.position_id
JOIN Spreadsheet s ON e.spreadsheet_id = s.spreadsheet_id;


----------- Empleado con salario y planilla -----------
CREATE VIEW Branch_Employee_View AS
SELECT 
    b.name AS branch_name,
    e.employee_id,
    e.name AS employee_name,
    p.name AS position_name,
    e.salary

FROM Branch b
JOIN Employee e ON e.branch_id = b.branch_id
JOIN Position p ON e.position_id = p.position_id;