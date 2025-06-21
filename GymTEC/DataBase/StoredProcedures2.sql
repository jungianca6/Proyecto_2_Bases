/* Stored Procedures necesarios para todo jeje */

------------------ GENERATE PAYROLL ------------------
CREATE OR REPLACE FUNCTION sp_generate_payroll(
    in_branch_name TEXT,
    in_description TEXT
)
RETURNS TABLE (
    employee_id TEXT,              -- número de cédula
    full_name TEXT,                -- nombre completo
    classes_or_hours INTEGER,      -- número de clases u horas
    amount_to_pay NUMERIC(10,2),   -- monto a pagar
    type TEXT                      -- tipo de planilla
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.employee_id::TEXT,
        e.name::TEXT AS full_name,

        -- cantidad de clases u horas según tipo
        CASE
            WHEN COALESCE(s.hours_worked, 0) > 0 THEN s.hours_worked
            WHEN COALESCE(s.classes_taught, 0) > 0 THEN s.classes_taught
            ELSE 0
        END AS classes_or_hours,

        -- cálculo del monto a pagar según tipo
        CASE
            WHEN COALESCE(s.hours_worked, 0) > 0 THEN COALESCE(s.hours_worked, 0) * COALESCE(s.hourly_rate, 0)
            WHEN COALESCE(s.classes_taught, 0) > 0 THEN COALESCE(s.classes_taught, 0) * COALESCE(s.class_rate, 0)
            ELSE COALESCE(e.salary, 0)
        END AS amount_to_pay,

        -- tipo de planilla inferido
        CASE
            WHEN COALESCE(s.hours_worked, 0) > 0 THEN 'Hora'
            WHEN COALESCE(s.classes_taught, 0) > 0 THEN 'Clase'
            ELSE 'Mensual'
        END AS type

    FROM Employee e
    JOIN Branch b ON e.branch_id = b.branch_id
    LEFT JOIN Spreadsheet s ON e.position_id = s.position_id
    WHERE b.name = in_branch_name;
END;
$$ LANGUAGE plpgsql;



------------------ Manage Payroll ------------------
CREATE OR REPLACE FUNCTION sp_manage_payroll_type(
    in_description TEXT,
    in_puesto TEXT,
    in_hourly_rate NUMERIC,
    in_class_rate NUMERIC,
    in_monthly_payment NUMERIC
)
RETURNS VOID AS $$
DECLARE
    pos_id INT;
BEGIN
    -- Buscar ID del puesto
    SELECT position_id INTO pos_id
    FROM Position
    WHERE name = in_puesto;

    IF pos_id IS NULL THEN
        RAISE EXCEPTION 'El puesto "%" no existe.', in_puesto;
    END IF;

    -- Actualizar si ya existe
    IF EXISTS (SELECT 1 FROM Spreadsheet WHERE position_id = pos_id) THEN
        UPDATE Spreadsheet
        SET
            hourly_rate = in_hourly_rate,
            class_rate = in_class_rate,
            monthly_rate = in_monthly_payment,
            description = in_description
        WHERE position_id = pos_id;
    ELSE
        -- Insertar si no existe
        INSERT INTO Spreadsheet(position_id, hourly_rate, class_rate, monthly_rate, description)
        VALUES (pos_id, in_hourly_rate, in_class_rate, in_monthly_payment, in_description);
    END IF;
END;
$$ LANGUAGE plpgsql;


------------------ Delete Payroll ------------------
CREATE OR REPLACE FUNCTION sp_delete_payroll_type(
    in_puesto TEXT
)
RETURNS VOID AS $$
DECLARE
    pos_id INT;
BEGIN
    -- Obtener el ID del puesto
    SELECT position_id INTO pos_id
    FROM Position
    WHERE name = in_puesto;

    IF pos_id IS NULL THEN
        RAISE EXCEPTION 'El puesto "%" no existe.', in_puesto;
    END IF;

    -- Eliminar de la tabla Spreadsheet
    DELETE FROM Spreadsheet
    WHERE position_id = pos_id;
END;
$$ LANGUAGE plpgsql;



----------------------  Ver workout plan ----------------------Add commentMore actions
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
        wp.day::TEXT,
        wp.exercise_name::TEXT,
        wp.sets,
        wp.repetitions,
        wp.notes::TEXT
    FROM Work_Plan wp
    WHERE wp.client_id = in_client_id;
END;
$$ LANGUAGE plpgsql;


----------------------  create workout plan ----------------------
CREATE OR REPLACE FUNCTION sp_create_workout_plan(
    in_client_id TEXT,
    in_period TEXT,
    in_day TEXT,
    in_exercise_name TEXT,
    in_sets INTEGER,
    in_repetitions INTEGER,
    in_notes TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO Work_Plan(
        period, client_id, day, exercise_name, sets, repetitions, notes
    )
    VALUES (
        in_period,
        CAST(in_client_id AS INT),
        in_day,
        in_exercise_name,
        in_sets,
        in_repetitions,
        in_notes
    );
END;
$$ LANGUAGE plpgsql;


----------------------  create or edit Servicio ----------------------
CREATE OR REPLACE FUNCTION sp_insert_or_edit_service(
    in_service_name TEXT,
    in_description TEXT,
    in_class_name TEXT
) RETURNS VOID AS $$
DECLARE
    v_class_id INT;
    existing_id INT;
BEGIN
    -- Buscar la clase por su tipo
    SELECT c.class_id INTO STRICT v_class_id
	FROM Class c
	WHERE c.type = in_class_name
	ORDER BY c.date DESC
	LIMIT 1;

    IF v_class_id IS NULL THEN
        RAISE EXCEPTION 'Clase no encontrada: %', in_class_name;
    END IF;

    -- Verificar si ya existe un servicio con ese nombre
    SELECT service_id INTO existing_id
    FROM Service
    WHERE name = in_service_name;

    -- Si existe, actualizar
    IF existing_id IS NOT NULL THEN
        UPDATE Service
        SET description = in_description,
            class_id = v_class_id
        WHERE service_id = existing_id;
    ELSE
        -- Si no existe, insertar
        INSERT INTO Service(name, description, class_id)
        VALUES (in_service_name, in_description, v_class_id);
    END IF;
END;
$$ LANGUAGE plpgsql;


----------------------  eliminar Servicio ----------------------
CREATE OR REPLACE FUNCTION sp_delete_service_by_name(in_name TEXT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Service
    WHERE name = in_name;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró un servicio con el nombre: %', in_name;
    END IF;
END;
$$ LANGUAGE plpgsql;




----------------------  get Servicio ----------------------
CREATE OR REPLACE FUNCTION sp_get_service_by_name(in_name TEXT)
RETURNS TABLE (
    service_name TEXT,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.type::TEXT AS service_name,
        s.description::TEXT
    FROM Service s
    JOIN Class c ON s.class_id = c.class_id
    WHERE s.name = in_name
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;



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
        JOIN Employee e ON c.employee_id = e.employee_id
        JOIN Branch b ON e.branch_id = b.branch_id
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