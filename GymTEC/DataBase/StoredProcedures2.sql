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
