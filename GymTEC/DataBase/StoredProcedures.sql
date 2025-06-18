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


---------------------- Para insertar branch ----------------------
CREATE OR REPLACE FUNCTION sp_insert_branch(
    in_name TEXT,
    in_province TEXT,
    in_canton TEXT,
    in_district TEXT,
    in_email TEXT,
    in_phone1 TEXT,
    in_phone2 TEXT,
    in_opening_date TIMESTAMP,
    in_opening_hours TEXT,
    in_spa BOOLEAN,
    in_store BOOLEAN
)
RETURNS INT AS $$
DECLARE
    new_branch_id INT;
BEGIN
    INSERT INTO Branch(name, province, canton, district, email, phone1, phone2, opening_date, opening_hours)
    VALUES (in_name, in_province, in_canton, in_district, in_email, in_phone1, in_phone2, in_opening_date, in_opening_hours)
    RETURNING branch_id INTO new_branch_id;

    IF in_spa THEN
        INSERT INTO Spa(name, is_active, branch_id)
        VALUES (in_name || ' Spa', TRUE, new_branch_id);
    END IF;

    IF in_store THEN
        INSERT INTO Store(name, is_active, branch_id)
        VALUES (in_name || ' Store', TRUE, new_branch_id);
    END IF;

    RETURN new_branch_id;
END;
$$ LANGUAGE plpgsql;


---------------------- Para editar branch ----------------------
CREATE OR REPLACE FUNCTION sp_edit_branch(
    in_name TEXT,
    in_province TEXT,
    in_canton TEXT,
    in_district TEXT,
    in_phone1 TEXT,
    in_phone2 TEXT,
    in_opening_date TIMESTAMP,
    in_opening_hours TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE Branch
    SET province = in_province,
        canton = in_canton,
        district = in_district,
        phone1 = in_phone1,
        phone2 = in_phone2,
        opening_date = in_opening_date,
        opening_hours = in_opening_hours
    WHERE name = in_name;
END;
$$ LANGUAGE plpgsql;


---------------------- Para eliminar branch ----------------------
CREATE OR REPLACE FUNCTION sp_delete_branch(in_name TEXT)
RETURNS VOID AS $$
DECLARE
    branch_id_to_delete INT;
BEGIN
    -- Obtener branch_id
    SELECT branch_id INTO branch_id_to_delete
    FROM Branch
    WHERE name = in_name;

    IF branch_id_to_delete IS NULL THEN
        RAISE EXCEPTION 'No existe una sucursal con el nombre %', in_name;
    END IF;

    -- Eliminar dependencias primero si las hay (Spa y Store relacionados)
    DELETE FROM Spa WHERE branch_id = branch_id_to_delete;
    DELETE FROM Store WHERE branch_id = branch_id_to_delete;

    -- Finalmente eliminar la sucursal
    DELETE FROM Branch WHERE branch_id = branch_id_to_delete;
END;
$$ LANGUAGE plpgsql;


---------------------- Para consultar branch ----------------------
CREATE OR REPLACE FUNCTION sp_consult_branch(in_name TEXT)
RETURNS TABLE (
    name VARCHAR(100),
    province VARCHAR(200),
    canton VARCHAR(200),
    district VARCHAR(200),
    opening_date DATE,
    opening_hours VARCHAR(100),
    phone1 VARCHAR(20),
    phone2 VARCHAR(20),
    spa_exists BOOLEAN,
    store_exists BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.name,
        b.province,
        b.canton,
        b.district,
        b.opening_date,
        b.opening_hours,
        b.phone1,
        b.phone2,
        EXISTS (SELECT 1 FROM Spa s WHERE s.branch_id = b.branch_id)::BOOLEAN,
        EXISTS (SELECT 1 FROM Store st WHERE st.branch_id = b.branch_id)::BOOLEAN
    FROM Branch b
    WHERE b.name = in_name;
END;
$$ LANGUAGE plpgsql;


---------------------- Para insertar Clases ----------------------
CREATE OR REPLACE FUNCTION sp_add_class(
    in_type TEXT,
    in_is_group BOOLEAN,
    in_max_capacity INTEGER,
    in_date TIMESTAMP,
    in_start TEXT, -- cambia a TEXT
    in_end TEXT,   -- cambia a TEXT
    in_employee_name TEXT
)
RETURNS VOID AS
$$
DECLARE
    emp_id INT;
BEGIN
    SELECT employee_id INTO emp_id FROM Employee WHERE name = in_employee_name;

    INSERT INTO Class (type, is_group, max_capacity, date, start_time, end_time, plan_id, employee_id)
    VALUES (
        in_type,
        in_is_group,
        in_max_capacity,
        CAST(in_date AS DATE),
        in_start::TIME,
        in_end::TIME,
        1, -- plan_id dummy
        emp_id
    );
END;
$$ LANGUAGE plpgsql;

---------------------- Para registrar Clases ----------------------
CREATE OR REPLACE FUNCTION sp_register_class(
    in_class_date DATE,
    in_start TEXT,
    in_end TEXT,
    in_instructor_name TEXT,
    in_available_spots INT
)
RETURNS VOID AS
$$
DECLARE
    emp_id INT;
    plan_id INT;
BEGIN
    -- Buscar el ID del instructor
    SELECT employee_id INTO emp_id
    FROM Employee
    WHERE name = in_instructor_name;

    IF emp_id IS NULL THEN
        RAISE EXCEPTION 'Instructor no encontrado';
    END IF;

    -- Obtener plan de trabajo del instructor (ejemplo: usar el primero)
    SELECT plan_id INTO plan_id
    FROM Work_Plan
    WHERE employee_id = emp_id
    LIMIT 1;

    IF plan_id IS NULL THEN
        RAISE EXCEPTION 'No hay plan de trabajo asignado';
    END IF;

    -- Insertar en la tabla Class
    INSERT INTO Class (type, is_group, max_capacity, date, start_time, end_time, plan_id, employee_id)
    VALUES ('General', TRUE, in_available_spots, in_class_date, in_start, in_end, plan_id, emp_id);
END;
$$ LANGUAGE plpgsql;

---------------------- Para registrar equipment_type ----------------------
CREATE OR REPLACE FUNCTION sp_insert_or_edit_equipment_type(
    in_name TEXT,
    in_description TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO Equipment_Type (name, description)
    VALUES (in_name, in_description)
    ON CONFLICT (name) DO UPDATE
    SET description = EXCLUDED.description;
END;
$$ LANGUAGE plpgsql;

---------------------- Para delete equipment_type ----------------------
CREATE OR REPLACE FUNCTION sp_delete_equipment_type(in_name TEXT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Equipment_Type WHERE name = in_name;
END;
$$ LANGUAGE plpgsql;

---------------------- Para consultar equipment_type ----------------------
CREATE OR REPLACE FUNCTION sp_get_equipment_type(in_name TEXT)
RETURNS TABLE (
    name VARCHAR(100),
    description VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT et.name, et.description
    FROM Equipment_Type et
    WHERE et.name = in_name;
END;
$$ LANGUAGE plpgsql;