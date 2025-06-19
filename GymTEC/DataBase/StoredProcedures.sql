/* Stored Procedures necesarios para todo jeje */


---------------------- Para el Login ----------------------
CREATE OR REPLACE FUNCTION sp_log_in_user(
    in_username TEXT,
    in_password TEXT
)
RETURNS TABLE (
    username TEXT,
    role TEXT,
    employee_id TEXT
) AS $$
BEGIN
    -- Buscar en Client
    RETURN QUERY
    SELECT 
        c.username::TEXT, 
        'Cliente'::TEXT, 
        c.client_id::TEXT
    FROM Client c
    WHERE c.username = in_username AND c.password = in_password;

    -- Si no encontró en Client, buscar en Employee
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            e.id_number::TEXT,
            'Instructor'::TEXT,
            e.employee_id::TEXT
        FROM Employee e
        WHERE e.id_number = in_username AND e.password = in_password;
    END IF;

    -- Si tampoco encontró en Employee, buscar en Admin
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            a.username::TEXT,
            'Admin'::TEXT,
            a.admin_id::TEXT
        FROM Admin a
        WHERE a.username = in_username AND a.password = in_password;
    END IF;

END;
$$ LANGUAGE plpgsql;

---------------------- Para el Register ----------------------Add commentMore actions
CREATE OR REPLACE FUNCTION sp_register_client(
    in_client_id INT,
    in_first_name TEXT,
    in_user_name TEXT,
    in_last_name_1 TEXT,
    in_last_name_2 TEXT,
    in_birth_date TEXT,
    in_weight INT,
    in_address TEXT,
    in_email TEXT,
    in_password TEXT,
    in_phone TEXT
)
RETURNS VOID AS $$
DECLARE
    full_name TEXT := in_first_name || ' ' || in_last_name_1 || ' ' || in_last_name_2;
BEGIN
    INSERT INTO Client (
        client_id, name, email, address, phone,
        password, birth_date, weight, username
    )
    VALUES (
        in_client_id, full_name, in_email, in_address, in_phone,
        in_password, in_birth_date::DATE, in_weight, in_user_name
    );
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
    in_opening_date TEXT, -- CAMBIO AQUÍ
    in_opening_hours TEXT,
    in_spa BOOLEAN,
    in_store BOOLEAN
)
RETURNS INT AS $$
DECLARE
    new_branch_id INT;
BEGIN
    INSERT INTO Branch(name, province, canton, district, email, phone1, phone2, opening_date, opening_hours)
    VALUES (
        in_name, in_province, in_canton, in_district, in_email,
        in_phone1, in_phone2,
        CAST(in_opening_date AS DATE), -- CONVERSIÓN AQUÍ
        in_opening_hours
    )
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

---------------------- Para insertar o editar inventory ----------------------
CREATE OR REPLACE FUNCTION sp_insert_or_edit_inventory(
    in_equipment_type_name TEXT,
    in_brand TEXT,
    in_serial_number TEXT,
    in_cost INTEGER,
    in_branch_name TEXT
)
RETURNS VOID AS $$
DECLARE
    eq_type_id INT;
    new_branch_id INT;
    inv_id INT;
BEGIN
    SELECT equipment_type_id INTO eq_type_id FROM Equipment_Type WHERE name = in_equipment_type_name;
    IF eq_type_id IS NULL THEN
        RAISE EXCEPTION 'Tipo de equipo no encontrado';
    END IF;

    SELECT branch_id INTO new_branch_id FROM Branch WHERE name = in_branch_name;
    IF new_branch_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal no encontrada';
    END IF;

    SELECT inventory_id INTO inv_id FROM Inventory WHERE serial_number = in_serial_number;

    IF inv_id IS NULL THEN
        INSERT INTO Inventory (description, brand, serial_number, cost, equipment_type_id, branch_id)
        VALUES (in_equipment_type_name, in_brand, in_serial_number, in_cost, eq_type_id, new_branch_id);
    ELSE
        UPDATE Inventory
        SET
            description = in_equipment_type_name,
            brand = in_brand,
            cost = in_cost,
            equipment_type_id = eq_type_id,
            branch_id = new_branch_id
        WHERE serial_number = in_serial_number;
    END IF;
END;
$$ LANGUAGE plpgsql;

---------------------- Para eliminar inventory ----------------------
CREATE OR REPLACE FUNCTION sp_delete_inventory_by_serial(in_serial_number TEXT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Inventory WHERE serial_number = in_serial_number;
END;
$$ LANGUAGE plpgsql;

---------------------- Para get inventory ----------------------
CREATE OR REPLACE FUNCTION sp_get_inventory_by_serial(in_serial_number TEXT)
RETURNS TABLE (
    equipment_type TEXT,
    brand TEXT,
    serial_number TEXT,
    cost INTEGER,
    branch_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        et.name::TEXT,	
        i.brand::TEXT,
        i.serial_number::TEXT,
        i.cost::INTEGER,
        b.name::TEXT
    FROM Inventory i
    JOIN Equipment_Type et ON i.equipment_type_id = et.equipment_type_id
    JOIN Branch b ON i.branch_id = b.branch_id
    WHERE i.serial_number = in_serial_number;
END;
$$ LANGUAGE plpgsql;


---------------------- Para asociar maquina con sucursal inventory ----------------------
CREATE OR REPLACE FUNCTION sp_associate_machine_to_branch(
    in_serial_number TEXT,
    in_branch_name TEXT
)
RETURNS TABLE (
    serial TEXT,
    brand TEXT,
    model TEXT,
    branch TEXT
) AS $$
DECLARE
    b_id INT;
BEGIN
    -- Buscar branch_id
    SELECT branch_id INTO b_id FROM Branch WHERE name = in_branch_name;

    -- Asociar la máquina al branch
    UPDATE Inventory
    SET branch_id = b_id
    WHERE Inventory.serial_number = in_serial_number;

    -- Devolver los datos
    RETURN QUERY
	SELECT 
	    i.serial_number::TEXT,
	    i.brand::TEXT,
	    et.name::TEXT,
	    b.name::TEXT
	FROM Inventory i
	JOIN Equipment_Type et ON i.equipment_type_id = et.equipment_type_id
	JOIN Branch b ON i.branch_id = b.branch_id
	WHERE i.serial_number = in_serial_number;
END;
$$ LANGUAGE plpgsql;

---------------------- Para consultar maquina por sucursal inventory ----------------------
CREATE OR REPLACE FUNCTION sp_consult_machines_by_branch(in_branch_name TEXT)
RETURNS TABLE (
    serial_number TEXT,
    brand TEXT,
    model TEXT,
    branch_name TEXT,
    is_associated BOOLEAN
) AS $$
BEGIN
    -- Máquinas asociadas a la sucursal
    RETURN QUERY
    SELECT 
        i.serial_number::TEXT,
        i.brand::TEXT,
        et.name::TEXT AS model,
        b.name::TEXT,
        TRUE
    FROM Inventory i
    JOIN Equipment_Type et ON i.equipment_type_id = et.equipment_type_id
    JOIN Branch b ON i.branch_id = b.branch_id
    WHERE b.name = in_branch_name;

    -- Máquinas no asociadas (sin sucursal asignada)
    RETURN QUERY
    SELECT 
        i.serial_number::TEXT,
        i.brand::TEXT,
        et.name::TEXT AS model,
        NULL::TEXT AS branch_name,
        FALSE
    FROM Inventory i
    JOIN Equipment_Type et ON i.equipment_type_id = et.equipment_type_id
    WHERE i.branch_id IS NULL;
END;
$$ LANGUAGE plpgsql;




---------------------- Para insertar o editar employee ----------------------
CREATE OR REPLACE FUNCTION sp_insert_or_edit_employee(
    in_employee_id TEXT,
    in_full_name TEXT,
    in_province TEXT,
    in_canton TEXT,
    in_district TEXT,
    in_position TEXT,
    in_branch TEXT,
    in_payroll_type TEXT,
    in_salary INT,
    in_email TEXT,
    in_password TEXT
)
RETURNS VOID AS $$
DECLARE
    existing_employee_id INT;
    branch_id INT;
    position_id INT;
BEGIN
    -- Verificar sucursal
    SELECT b.branch_id INTO branch_id FROM Branch b WHERE b.name = in_branch;
    IF branch_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal no encontrada';
    END IF;

    -- Verificar posición
    SELECT p.position_id INTO position_id FROM Position p WHERE p.name = in_position;
    IF position_id IS NULL THEN
        RAISE EXCEPTION 'Puesto no encontrado';
    END IF;

    -- Verificar si ya existe el empleado
    SELECT e.employee_id INTO existing_employee_id FROM Employee e WHERE e.id_number = in_employee_id;

    -- Si no existe, lo insertamos
    IF existing_employee_id IS NULL THEN
        INSERT INTO Employee (
            name, province, canton, district,
            email, id_number, password, salary,
            bank_account, position_id, spreadsheet_id, branch_id
        )
        VALUES (
            in_full_name, in_province, in_canton, in_district,
            in_email, in_employee_id, in_password, in_salary,
            'TEMP',            -- Bank account temporal
            position_id,       -- Asociado por nombre
            1,                 -- Planilla genérica
            branch_id          -- Asociado por nombre
        );
    END IF;
    -- Si ya existe, NO se actualiza nada
END;
$$ LANGUAGE plpgsql;


----------------------  editar employee ----------------------
CREATE OR REPLACE FUNCTION sp_edit_employee(
    in_id_number TEXT,
    in_full_name TEXT,
    in_province TEXT,
    in_canton TEXT,
    in_district TEXT,
    in_position TEXT,
    in_branch TEXT,
    in_payroll_type TEXT,
    in_salary INTEGER,
    in_email TEXT,
    in_password TEXT
)
RETURNS VOID AS $$
DECLARE
    emp_id INT;
    pos_id INT;
    br_id INT;
BEGIN
    -- Verificar si el empleado existe
    SELECT employee_id INTO emp_id FROM Employee WHERE id_number = in_id_number;
    IF emp_id IS NULL THEN
        RAISE EXCEPTION 'Empleado no existe con la cédula proporcionada';
    END IF;

    -- Obtener ID del puesto
    SELECT position_id INTO pos_id FROM Position WHERE name = in_position;
    IF pos_id IS NULL THEN
        RAISE EXCEPTION 'Puesto no encontrado';
    END IF;

    -- Obtener ID de la sucursal
    SELECT branch_id INTO br_id FROM Branch WHERE name = in_branch;
    IF br_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal no encontrada';
    END IF;

    -- Actualizar el empleado
    UPDATE Employee
    SET
        name = in_full_name,
        province = in_province,
        canton = in_canton,
        district = in_district,
        email = in_email,
        password = in_password,
        salary = in_salary,
        position_id = pos_id,
        branch_id = br_id
        -- NOTA: spreadsheet_id queda igual
    WHERE id_number = in_id_number;
END;
$$ LANGUAGE plpgsql;



----------------------  Generar planilla(spreadsheet/payroll) ----------------------
CREATE OR REPLACE FUNCTION sp_generate_payroll(in_branch_name TEXT)
RETURNS TABLE (
    employee_id TEXT,
    full_name TEXT,
    classes_or_hours INTEGER,
    amount_to_pay NUMERIC(10,2),
    type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.employee_id::TEXT,
        e.name::TEXT AS full_name,
        COUNT(c.class_id)::INTEGER AS classes_or_hours,
        COUNT(c.class_id)::NUMERIC * COALESCE(s.class_rate, 0) AS amount_to_pay,
        'Clase'::TEXT AS type
    FROM Employee e
    JOIN Branch b ON e.branch_id = b.branch_id
    JOIN Class c ON e.employee_id = c.employee_id
    LEFT JOIN Spreadsheet s ON e.position_id = s.position_id
    WHERE b.name = in_branch_name
    GROUP BY e.employee_id, e.name, s.class_rate;
END;
$$ LANGUAGE plpgsql;



----------------------  insert Position ----------------------



CREATE OR REPLACE FUNCTION sp_insert_position(
    in_name TEXT,
    in_description TEXT
)
RETURNS INT AS $$
DECLARE
    new_id INT;
    existing_id INT;
BEGIN
    -- Verifica si ya existe un puesto con el mismo nombre (case insensitive)
    SELECT position_id INTO existing_id
    FROM Position
    WHERE LOWER(name) = LOWER(in_name);

    IF FOUND THEN
        RAISE EXCEPTION 'Ya existe un puesto con ese nombre';
    END IF;

    INSERT INTO Position (name, description)
    VALUES (in_name, in_description)
    RETURNING position_id INTO new_id;

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

----------------------  edit Position ----------------------

CREATE OR REPLACE FUNCTION sp_edit_position(
    in_position_id INT,
    in_name TEXT,
    in_description TEXT
)
RETURNS VOID AS $$
DECLARE
    existing_id INT;
BEGIN
    -- Verifica si el puesto existe
    IF NOT EXISTS (SELECT 1 FROM Position WHERE position_id = in_position_id) THEN
        RAISE EXCEPTION 'No existe un puesto con ese ID';
    END IF;

    -- Verifica que no exista otro puesto con el mismo nombre
    SELECT position_id INTO existing_id
    FROM Position
    WHERE LOWER(name) = LOWER(in_name)
      AND position_id != in_position_id;

    IF FOUND THEN
        RAISE EXCEPTION 'Ya existe otro puesto con ese nombre';
    END IF;

    -- Actualiza los datos
    UPDATE Position
    SET name = in_name,
        description = in_description
    WHERE position_id = in_position_id;
END;
$$ LANGUAGE plpgsql;   


----------------------  consult Position ----------------------

CREATE OR REPLACE FUNCTION sp_consult_position(in_name TEXT)
RETURNS TABLE (
    position_id INT,
    position_name TEXT,
    description TEXT
) AS $$
BEGIN
    -- Verifica existencia
    IF NOT EXISTS (
        SELECT 1 
        FROM Position p
        WHERE LOWER(p.name) = LOWER(in_name)
    ) THEN
        RAISE EXCEPTION 'No existe un puesto con ese nombre';
    END IF;

    -- Devuelve la fila con casts explícitos a TEXT
    RETURN QUERY
    SELECT
        p.position_id,
        p.name::TEXT         AS position_name,
        p.description::TEXT  AS description
    FROM Position p
    WHERE LOWER(p.name) = LOWER(in_name);
END;
$$ LANGUAGE plpgsql;
----------------------  delete Position ----------------------

CREATE OR REPLACE FUNCTION sp_delete_position(in_name TEXT)
RETURNS VOID AS $$
DECLARE
    pos_id   INT;
    emp_count INT;
BEGIN
    -- 1. Verificar que el puesto exista
    SELECT position_id
      INTO pos_id
      FROM Position p
     WHERE LOWER(p.name) = LOWER(in_name);

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe un puesto con ese nombre';
    END IF;

    -- 2. Verificar que no haya empleados asignados
    SELECT COUNT(*) 
      INTO emp_count
      FROM Employee e
     WHERE e.position_id = pos_id;

    IF emp_count > 0 THEN
        RAISE EXCEPTION 'No se puede eliminar: hay % asignado(s) a este puesto', emp_count;
    END IF;

    -- 3. Borrar el puesto
    DELETE FROM Position
     WHERE position_id = pos_id;
END;
$$ LANGUAGE plpgsql;

