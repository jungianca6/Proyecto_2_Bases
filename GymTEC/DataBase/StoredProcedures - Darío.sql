/* Stored Procedures necesarios para todo jeje */



CREATE OR REPLACE FUNCTION sp_copy_schedule(
    in_branch_name TEXT,
    in_start_week TEXT,
    in_end_week TEXT
)
RETURNS TABLE (
    activity_name TEXT,
    date TEXT,
    start_time TEXT,
    end_time TEXT
) AS $$
DECLARE
    offset_days INT := 7;
    r RECORD;
BEGIN
    FOR r IN
        SELECT c.type, c.date, c.start_time, c.end_time, c.is_group, 
               c.max_capacity, c.plan_id, c.employee_id
        FROM Class c
        JOIN Work_Plan wp ON c.plan_id = wp.plan_id
        JOIN Branch b ON wp.branch_id = b.branch_id
        WHERE b.name = in_branch_name
          AND c.date BETWEEN CAST(in_start_week AS DATE) AND CAST(in_end_week AS DATE)
    LOOP
        -- Insertar nueva clase en la semana siguiente
        INSERT INTO Class (type, is_group, max_capacity, date, start_time, end_time, plan_id, employee_id)
        VALUES (
            r.type,
            r.is_group,
            r.max_capacity,
            r.date + offset_days,
            r.start_time,
            r.end_time,
            r.plan_id,
            r.employee_id
        );

        -- Retornar info copiada
        activity_name := r.type;
        date := TO_CHAR(r.date + offset_days, 'YYYY-MM-DD');
        start_time := TO_CHAR(r.start_time, 'HH24:MI');
        end_time := TO_CHAR(r.end_time, 'HH24:MI');
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;