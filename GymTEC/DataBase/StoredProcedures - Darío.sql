/* Stored Procedures necesarios para todo jeje */


----------------------  Copiar schedule ----------------------
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


----------------------  ver workout plan ----------------------
CREATE OR REPLACE FUNCTION sp_view_workout_plan(in_client_id INT)
RETURNS TABLE (
    day TEXT,
    exercise_name TEXT,
    sets INT,
    repetitions INT,
    notes TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wp.period::TEXT AS day,
        wp.description::TEXT AS exercise_name,
        3::INT AS sets,
        12::INT AS repetitions,
        'Ejercicio general'::TEXT AS notes
    FROM Work_Plan wp
    WHERE wp.client_id = in_client_id;
END;
$$ LANGUAGE plpgsql;


----------------------  create workout plan ----------------------
CREATE OR REPLACE FUNCTION sp_create_workout_plan(
    in_client_id TEXT,
    in_description TEXT,
    in_period TEXT,
    in_branch_name TEXT,
    in_day TEXT,
    in_exercise_name TEXT,
    in_sets INTEGER,
    in_repetitions INTEGER,
    in_notes TEXT
) RETURNS VOID AS $$
DECLARE
    v_branch_id INT;
BEGIN
    SELECT branch_id INTO v_branch_id
    FROM Branch
    WHERE name = in_branch_name;

    IF v_branch_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal no encontrada: %', in_branch_name;
    END IF;

    INSERT INTO Work_Plan(
        description, period, branch_id, client_id, day, exercise_name, sets, repetitions, notes
    )
    VALUES (
        in_description,
        in_period,
        v_branch_id,
        CAST(in_client_id AS INT),
        in_day,
        in_exercise_name,
        in_sets,
        in_repetitions,
        in_notes
    );
END;
$$ LANGUAGE plpgsql;