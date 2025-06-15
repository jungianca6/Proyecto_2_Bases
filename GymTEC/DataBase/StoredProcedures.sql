/* Stored Procedures necesarios para todo jeje */


---------------------- Para el Login ----------------------
CREATE OR REPLACE FUNCTION sp_log_in_user(
    in_username VARCHAR,
    in_password VARCHAR
)
RETURNS TABLE (
    username VARCHAR,   
    role VARCHAR,          
    employee_id INT        
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.username,
        p.name AS role,
        e.employee_id
    FROM 
        Employee e
    JOIN Position p ON e.position_id = p.position_id
    WHERE 
        e.username = in_username
        AND e.password = in_password;
END;
$$ LANGUAGE plpgsql;