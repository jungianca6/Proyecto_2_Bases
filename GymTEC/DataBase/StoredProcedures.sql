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
            'Administrador'::TEXT,
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
    in_payroll_id INT,
    in_salary INT,
    in_email TEXT,
    in_password TEXT
)
RETURNS VOID AS $$
DECLARE
    v_existing_employee_id INT;
    v_branch_id INT;
    v_position_id INT;
    v_spreadsheet_exists BOOLEAN;
BEGIN
    -- Validar sucursal
    SELECT branch_id INTO v_branch_id FROM Branch WHERE name = in_branch;
    IF v_branch_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal no encontrada';
    END IF;

    -- Validar puesto
    SELECT position_id INTO v_position_id FROM Position WHERE name = in_position;
    IF v_position_id IS NULL THEN
        RAISE EXCEPTION 'Puesto no encontrado';
    END IF;

    -- Validar existencia de planilla
    SELECT EXISTS (SELECT 1 FROM Spreadsheet WHERE spreadsheet_id = in_payroll_id) INTO v_spreadsheet_exists;
    IF NOT v_spreadsheet_exists THEN
        RAISE EXCEPTION 'Planilla no encontrada';
    END IF;

    -- Verificar si ya existe el empleado
    SELECT employee_id INTO v_existing_employee_id FROM Employee WHERE id_number = in_employee_id;

    IF v_existing_employee_id IS NULL THEN
        INSERT INTO Employee (
            name, province, canton, district,
            email, id_number, password, salary,
            bank_account, position_id, spreadsheet_id, branch_id
        )
        VALUES (
            in_full_name, in_province, in_canton, in_district,
            in_email, in_employee_id, in_password, in_salary,
            'TEMP',
            v_position_id,
            in_payroll_id,
            v_branch_id
        );
    END IF;
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
    in_payroll_id INT,
    in_salary INTEGER,
    in_email TEXT,
    in_password TEXT
)
RETURNS VOID AS $$
DECLARE
    emp_id INT;
    pos_id INT;
    br_id INT;
    spreadsheet_exists BOOLEAN;
BEGIN
    -- Validar existencia del empleado
    SELECT employee_id INTO emp_id FROM Employee WHERE id_number = in_id_number;
    IF emp_id IS NULL THEN
        RAISE EXCEPTION 'Empleado no existe con la cédula proporcionada';
    END IF;

    -- Validar existencia del puesto
    SELECT position_id INTO pos_id FROM Position WHERE name = in_position;
    IF pos_id IS NULL THEN
        RAISE EXCEPTION 'Puesto no encontrado';
    END IF;

    -- Validar existencia de la sucursal
    SELECT branch_id INTO br_id FROM Branch WHERE name = in_branch;
    IF br_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal no encontrada';
    END IF;

    -- Validar existencia de la planilla
    SELECT EXISTS (SELECT 1 FROM Spreadsheet WHERE spreadsheet_id = in_payroll_id) INTO spreadsheet_exists;
    IF NOT spreadsheet_exists THEN
        RAISE EXCEPTION 'Planilla no encontrada';
    END IF;

    -- Actualizar datos del empleado
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
        branch_id = br_id,
        spreadsheet_id = in_payroll_id
    WHERE id_number = in_id_number;
END;
$$ LANGUAGE plpgsql;



----------------------  Generar planilla(spreadsheet/payroll) ----------------------
CREATE OR REPLACE FUNCTION sp_generate_payroll(in_branch_name TEXT)
RETURNS TABLE (
    id_number TEXT,
    full_name TEXT,
    classes_or_hours INTEGER,
    amount_to_pay NUMERIC(10,2),
    type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id_number::TEXT,
        e.name::TEXT AS full_name,
        COUNT(c.class_id)::INTEGER AS classes_or_hours,
        COUNT(c.class_id)::NUMERIC * COALESCE(s.class_rate, 0) AS amount_to_pay,
        'Clase'::TEXT AS type
    FROM Employee e
    JOIN Branch b ON e.branch_id = b.branch_id
    JOIN Class c ON e.employee_id = c.employee_id
    LEFT JOIN Spreadsheet s ON e.position_id = s.position_id
    WHERE b.name = in_branch_name
    GROUP BY e.id_number, e.name, s.class_rate;
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

----------------------  Product insert or edit ----------------------

CREATE OR REPLACE FUNCTION sp_insert_or_edit_product(
    in_name TEXT,
    in_barcode TEXT,
    in_description TEXT,
    in_cost INT
)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM Product WHERE barcode = in_barcode) THEN
        -- Actualizar producto existente
        UPDATE Product
        SET name = in_name,
            description = in_description,
            cost = in_cost
        WHERE barcode = in_barcode;
    ELSE
        -- Insertar nuevo producto con store_id = 1 por defecto
        INSERT INTO Product (name, barcode, description, cost, is_active, store_id)
        VALUES (in_name, in_barcode, in_description, in_cost, TRUE, 1);
    END IF;
END;
$$ LANGUAGE plpgsql;

----------------------  delete Product ----------------------

CREATE OR REPLACE FUNCTION sp_delete_product(
    in_barcode TEXT
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Product
    WHERE barcode = in_barcode;
END;
$$ LANGUAGE plpgsql;

----------------------  get Products ----------------------

CREATE OR REPLACE FUNCTION sp_get_product(
    in_barcode TEXT
)
RETURNS TABLE (
    product_name TEXT,
    barcode TEXT,
    description TEXT,
    cost INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name::TEXT AS product_name, 
        p.barcode::TEXT, 
        p.description::TEXT, 
        p.cost::INT           
    FROM Product p
    WHERE p.barcode = in_barcode
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

----------------------  insert_spa_treatment ----------------------
DROP FUNCTION IF EXISTS sp_insert_spa_treatment(TEXT);

CREATE OR REPLACE FUNCTION sp_insert_spa_treatment(in_name TEXT)
RETURNS INT AS $$
DECLARE
    new_id INT;
BEGIN
    -- Verifica si el tratamiento ya existe por nombre
    IF EXISTS (SELECT 1 FROM Spa_Treatment WHERE name = in_name) THEN
        RAISE EXCEPTION 'Ya existe un tratamiento spa con ese nombre.';
    END IF;

    -- Calcula el nuevo ID y lo inserta
    SELECT COALESCE(MAX(treatment_id), 0) + 1 INTO new_id FROM Spa_Treatment;

    INSERT INTO Spa_Treatment (treatment_id, name, description)
    VALUES (new_id, in_name, 'Sin descripción');

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

----------------------  edit_spa_treatment ----------------------
DROP FUNCTION IF EXISTS sp_edit_spa_treatment(INT, TEXT);

CREATE OR REPLACE FUNCTION sp_edit_spa_treatment(in_id INT, in_name TEXT)
RETURNS VOID AS $$
DECLARE
    existing_id INT;
BEGIN
    -- Verifica si el tratamiento con ese ID existe
    IF NOT EXISTS (SELECT 1 FROM Spa_Treatment WHERE treatment_id = in_id) THEN
        RAISE EXCEPTION 'No existe un tratamiento spa con el ID %.', in_id;
    END IF;
	
    -- Realiza la actualización del nombre
    UPDATE Spa_Treatment
    SET name = in_name
    WHERE treatment_id = in_id;
END;
$$ LANGUAGE plpgsql;


----------------------  delete_spa_treatment ----------------------

DROP FUNCTION IF EXISTS sp_delete_spa_treatment(TEXT);

CREATE OR REPLACE FUNCTION sp_delete_spa_treatment(in_name TEXT)
RETURNS VOID AS $$
DECLARE
    v_treatment_id INT;
BEGIN
    -- Obtener el ID del tratamiento basado en el nombre
    SELECT treatment_id INTO v_treatment_id
    FROM Spa_Treatment
    WHERE name = in_name;

    IF v_treatment_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró tratamiento con el nombre %', in_name;
    END IF;

    -- Eliminar asociaciones en la tabla intermedia
    DELETE FROM Spa_Treatment_Branch
    WHERE treatment_id = v_treatment_id;

    -- Eliminar el tratamiento
    DELETE FROM Spa_Treatment
    WHERE treatment_id = v_treatment_id;
END;
$$ LANGUAGE plpgsql;

----------------------  consult_spa_treatment ----------------------

DROP FUNCTION IF EXISTS sp_get_spa_treatment_by_name(p_name TEXT);

CREATE OR REPLACE FUNCTION sp_get_spa_treatment_by_name(
    p_name TEXT
)
RETURNS TABLE (
    treatment_id INT,
    treatment_name VARCHAR(100),
    description VARCHAR(200)
) AS $$
BEGIN
    RETURN QUERY
    SELECT st.treatment_id, st.name AS treatment_name, st.description
    FROM Spa_Treatment st
    WHERE st.name = p_name;
END;
$$ LANGUAGE plpgsql;

-- ----------------------  sp_associate_spa_treatment ----------------------
DROP FUNCTION IF EXISTS sp_associate_spa_treatment_by_name(TEXT, TEXT);


CREATE OR REPLACE FUNCTION sp_associate_spa_treatment_by_name(
    in_treatment_name TEXT,
    in_branch_name TEXT
)
RETURNS VOID AS $$
DECLARE
    v_branch_id INT;
    v_treatment_id INT;
BEGIN
    -- Obtener ID de sucursal
    SELECT branch_id INTO v_branch_id
    FROM Branch
    WHERE name = in_branch_name;

    IF v_branch_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal con nombre "%" no encontrada.', in_branch_name;
    END IF;

    -- Obtener ID de tratamiento
    SELECT treatment_id INTO v_treatment_id
    FROM Spa_Treatment
    WHERE name = in_treatment_name;

    IF v_treatment_id IS NULL THEN
        RAISE EXCEPTION 'Tratamiento con nombre "%" no encontrado.', in_treatment_name;
    END IF;

    -- Asociar evitando duplicados
    INSERT INTO Spa_Treatment_Branch (treatment_id, branch_id)
    VALUES (v_treatment_id, v_branch_id)
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- ----------------------  sp_search_spa_treatments_by_name ----------------------

-- Asociados
DROP FUNCTION IF EXISTS sp_get_associated_spa_treatments(TEXT);

CREATE OR REPLACE FUNCTION sp_get_associated_spa_treatments(p_branch_name TEXT)
RETURNS TABLE(treatment_id INT, treatment_name VARCHAR(100)) AS $$
BEGIN
    RETURN QUERY
    SELECT st.treatment_id, st.name
    FROM Spa_Treatment st
    JOIN Spa_Treatment_Branch stb ON st.treatment_id = stb.treatment_id
    JOIN Branch b ON b.branch_id = stb.branch_id
    WHERE b.name = p_branch_name;
END;
$$ LANGUAGE plpgsql;

-- No asociados
DROP FUNCTION IF EXISTS sp_get_not_associated_spa_treatments(TEXT);

CREATE OR REPLACE FUNCTION sp_get_not_associated_spa_treatments(p_branch_name TEXT)
RETURNS TABLE(treatment_id INT, treatment_name VARCHAR(100)) AS $$
DECLARE
    v_branch_id INT;
BEGIN
    SELECT branch_id INTO v_branch_id
    FROM Branch
    WHERE name = p_branch_name;

    IF v_branch_id IS NULL THEN
        RAISE EXCEPTION 'Branch name % not found', p_branch_name;
    END IF;

    RETURN QUERY
    SELECT st.treatment_id, st.name
    FROM Spa_Treatment st
    WHERE st.treatment_id NOT IN (
        SELECT stb.treatment_id
        FROM Spa_Treatment_Branch stb
        WHERE stb.branch_id = v_branch_id
    );
END;
$$ LANGUAGE plpgsql;


------------------ sp_assign_trainer_to_client ----------------
DROP FUNCTION IF EXISTS sp_assign_trainer_to_client(INT, TEXT);

CREATE OR REPLACE FUNCTION sp_assign_trainer_to_client(
    in_client_id INT,
    in_trainer_id TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Validar que el cliente exista
    IF NOT EXISTS (SELECT 1 FROM Client WHERE client_id = in_client_id) THEN
        RAISE EXCEPTION 'Cliente con ID % no existe', in_client_id;
    END IF;

    -- Validar que el entrenador exista
    IF NOT EXISTS (SELECT 1 FROM Employee WHERE employee_id = in_trainer_id) THEN
        RAISE EXCEPTION 'Entrenador con cédula % no existe', in_trainer_id;
    END IF;

    -- Asignar el entrenador al cliente
    UPDATE Client
    SET trainer_id = in_trainer_id
    WHERE client_id = in_client_id;
END;
$$ LANGUAGE plpgsql;


------------------ sp_get_clients_without_trainer ----------------

CREATE OR REPLACE FUNCTION sp_get_clients_without_trainer()
RETURNS TABLE (
    client_id INT,
    full_name VARCHAR(150),
    id_number TEXT,
    email TEXT,
    phone TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.client_id,
        c.name AS full_name,
        c.username AS id_number, -- o usar un campo de cédula si tienes, aquí pongo username como ejemplo
        c.email,
        c.phone
    FROM Client c
    LEFT JOIN Trainer_Client tc ON c.client_id = tc.client_id
    WHERE tc.client_id IS NULL;
END;
$$ LANGUAGE plpgsql;

------------------ sp_register_class ----------------

CREATE OR REPLACE FUNCTION sp_register_class(
    in_class_type VARCHAR,
    in_instructor_name VARCHAR,
    in_is_group BOOLEAN,
    in_capacity INT,
    in_date DATE,
    in_start_time TIME,
    in_end_time TIME
)
RETURNS VOID AS $$
DECLARE
    v_employee_id TEXT;
BEGIN
    -- Busca el ID del empleado (instructor) por nombre exacto
    SELECT employee_id INTO v_employee_id
    FROM Employee
    WHERE name = in_instructor_name
    LIMIT 1;

    IF v_employee_id IS NULL THEN
        RAISE EXCEPTION 'Instructor no encontrado con nombre %', in_instructor_name;
    END IF;

    -- Inserta la clase con el employee_id encontrado
    INSERT INTO Class (
        type,
        is_group,
        max_capacity,
        date,
        start_time,
        end_time,
        plan_id,
        employee_id
    )
    VALUES (
        in_class_type,
        in_is_group,
        in_capacity,
        in_date,
        in_start_time,
        in_end_time,
        NULL, -- Asumiendo que plan_id puede ser NULL o ajustar según necesidades
        v_employee_id
    );
END;
$$ LANGUAGE plpgsql;   







------------------ asociar product y store ----------------




DROP FUNCTION IF EXISTS sp_associate_store_product(TEXT, TEXT, TEXT, INT);

CREATE OR REPLACE FUNCTION sp_associate_store_product(
    in_barcode TEXT,
    in_store_name TEXT,
    in_date TEXT,
    in_amount INT
)
RETURNS VOID AS $$
DECLARE
    v_product_id INT;
    v_store_id INT;
    v_entry_date DATE;
BEGIN
    -- Buscar el ID de la tienda
    SELECT store_id INTO v_store_id
    FROM Store
    WHERE name = in_store_name;

    IF v_store_id IS NULL THEN
        RAISE EXCEPTION 'Tienda con nombre "%" no encontrada.', in_store_name;
    END IF;

    -- Buscar el ID del producto
    SELECT product_id INTO v_product_id
    FROM Product
    WHERE barcode = in_barcode;

    IF v_product_id IS NULL THEN
        RAISE EXCEPTION 'Producto con código de barras "%" no encontrado.', in_barcode;
    END IF;

    -- Convertir fecha
    v_entry_date := TO_DATE(in_date, 'YYYY-MM-DD');

    -- Insertar la asociación (reemplazar cantidad y fecha si ya existe)
    INSERT INTO Product_Store (product_id, store_id, quantity, entry_date)
    VALUES (v_product_id, v_store_id, in_amount, v_entry_date)
    ON CONFLICT (product_id, store_id)
    DO UPDATE SET quantity = EXCLUDED.quantity, entry_date = EXCLUDED.entry_date;
END;
$$ LANGUAGE plpgsql;    







------------------ consulta de asocie product y store ----------------



DROP FUNCTION IF EXISTS sp_get_associated_store_products(TEXT);

CREATE OR REPLACE FUNCTION sp_get_associated_store_products(p_store_name TEXT)
RETURNS TABLE(barcode TEXT, product_name TEXT, entry_date TEXT, amount INT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.barcode::TEXT,
        p.name::TEXT,
        TO_CHAR(ps.entry_date, 'YYYY-MM-DD')::TEXT,
        ps.quantity
    FROM Product_Store ps
    JOIN Product p ON p.product_id = ps.product_id
    JOIN Store s ON s.store_id = ps.store_id
    WHERE s.name = p_store_name;
END;
$$ LANGUAGE plpgsql;    




DROP FUNCTION IF EXISTS sp_get_not_associated_store_products(TEXT);

CREATE OR REPLACE FUNCTION sp_get_not_associated_store_products(p_store_name TEXT)
RETURNS TABLE(barcode TEXT, product_name TEXT, entry_date TEXT, amount INT) AS $$
DECLARE
    v_store_id INT;
BEGIN
    SELECT store_id INTO v_store_id
    FROM Store
    WHERE name = p_store_name;

    IF v_store_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró la tienda con nombre "%"', p_store_name;
    END IF;

    RETURN QUERY
    SELECT 
        p.barcode::TEXT,
        p.name::TEXT,
        NULL::TEXT AS entry_date,
        NULL::INT AS amount
    FROM Product p
    WHERE p.product_id NOT IN (
        SELECT ps.product_id
        FROM Product_Store ps
        WHERE ps.store_id = v_store_id
    );
END;
$$ LANGUAGE plpgsql;

------------------ instert store ----------------








 -- Procedimiento para insertar una tienda asociada a una sucursal
CREATE OR REPLACE FUNCTION sp_insert_store(
    in_branch_name TEXT,
    in_store_name TEXT,
    in_is_active BOOLEAN
)
RETURNS VOID AS $$
DECLARE
    branch_id_found INT;
BEGIN
    -- Buscar el ID de la sucursal
    SELECT branch_id INTO branch_id_found
    FROM Branch
    WHERE name = in_branch_name;

    -- Validar si la sucursal existe
    IF branch_id_found IS NULL THEN
        RAISE EXCEPTION 'Sucursal con nombre "%" no encontrada', in_branch_name;
    END IF;

    -- Insertar la tienda con el ID de la sucursal
    INSERT INTO Store (name, is_active, branch_id)
    VALUES (in_store_name, in_is_active, branch_id_found);
END;
$$ LANGUAGE plpgsql;





------------------ edit store ----------------

-- Procedimiento para editar el estado de una tienda
CREATE OR REPLACE FUNCTION sp_edit_store(
    in_branch_name TEXT,
    in_store_name TEXT,
    in_is_active BOOLEAN
)
RETURNS VOID AS $$
DECLARE
    branch_id_found INT;
    store_id_found INT;
BEGIN
    -- Buscar el ID de la sucursal
    SELECT branch_id INTO branch_id_found
    FROM Branch
    WHERE name = in_branch_name;

    IF branch_id_found IS NULL THEN
        RAISE EXCEPTION 'Sucursal "%" no encontrada', in_branch_name;
    END IF;

    -- Buscar el ID de la tienda dentro de esa sucursal
    SELECT store_id INTO store_id_found
    FROM Store
    WHERE name = in_store_name AND branch_id = branch_id_found;

    IF store_id_found IS NULL THEN
        RAISE EXCEPTION 'Tienda "%" no encontrada en la sucursal "%"', in_store_name, in_branch_name;
    END IF;

    -- Actualizar el estado de la tienda
    UPDATE Store
    SET is_active = in_is_active
    WHERE store_id = store_id_found;
END;
$$ LANGUAGE plpgsql;  





------------------ get stores ----------------






CREATE OR REPLACE FUNCTION sp_get_stores_by_branch_name(in_branch_name TEXT)
RETURNS TABLE (
    store_id INT,
    name TEXT,
    is_active BOOLEAN,
    branch_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.store_id::INT,
        s.name::TEXT,
        s.is_active::BOOLEAN,
        b.name::TEXT
    FROM Store s
    JOIN Branch b ON s.branch_id = b.branch_id
    WHERE b.name = in_branch_name;
END;
$$ LANGUAGE plpgsql;

------------------ delete stores ----------------



CREATE OR REPLACE FUNCTION sp_delete_store_by_name(in_store_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INT;
BEGIN
    -- 1. Obtener el ID de la tienda
    DELETE FROM product_store
    WHERE store_id IN (
        SELECT store_id FROM Store WHERE name = in_store_name
    );

    -- 2. Luego eliminar la tienda
    DELETE FROM Store
    WHERE name = in_store_name;

    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;
$$ LANGUAGE plpgsql;

----------------- Copy Branch-------------------

-- ---------------------- sp_copy_entire_branch ----------------------
-- Crea una nueva sucursal y copia:
-- 1. Tratamientos del spa
-- 2. Tienda y productos
-- 3. Clases (sin instructor)
-- 4. Inventario
-- La sucursal nueva se crea primero con valores genéricos.

CREATE OR REPLACE FUNCTION sp_copy_entire_branch(
    in_old_branch_name TEXT,
    in_new_branch_name TEXT
)
RETURNS VOID AS $$
DECLARE
    new_branch_id INT;
BEGIN
    -- Paso 1: Crear sucursal nueva con nombre especificado
    new_branch_id := sp_copy_branch(in_old_branch_name, in_new_branch_name);

    -- Paso 2: Copiar tratamientos del spa
    PERFORM sp_copy_spa_treatments(in_old_branch_name, in_new_branch_name);

    -- Paso 3: Copiar tienda y productos
    PERFORM sp_copy_store_and_products(in_old_branch_name, in_new_branch_name);

    -- Paso 4: Copiar clases sin instructor (misma plan_id)
    PERFORM sp_copy_classes_by_branch_names(in_old_branch_name, in_new_branch_name);

    -- Paso 5: Copiar inventario
    PERFORM sp_copy_inventory(in_old_branch_name, in_new_branch_name);
END;
$$ LANGUAGE plpgsql;



-- ---------------------- sp_copy_branch ----------------------
-- Crea una nueva sucursal con el nombre nuevo dado.
-- Los demás campos propios de la sucursal se asignan valores genéricos por defecto,
-- porque no se deben copiar del original y no permiten NULL.

CREATE OR REPLACE FUNCTION sp_copy_branch(
    in_old_branch_name TEXT,   -- parámetro para identificar sucursal original (no se usa para copiar datos)
    in_new_branch_name TEXT    -- nombre de la nueva sucursal
)
RETURNS INT AS $$
DECLARE
    new_branch_id INT;
BEGIN
    -- Insertar nueva sucursal con sólo el nombre nuevo,
    -- los demás campos con valores genéricos o vacíos (ajustar según convenga)
    INSERT INTO Branch (
        name,
        province,
        canton,
        district,
        email,
        phone1,
        phone2,
        opening_date,
        opening_hours
    )
    VALUES (
        in_new_branch_name,
        'N/A',          -- provincia
        'N/A',          -- cantón
        'N/A',          -- distrito
        'noemail@na.com',   -- email genérico
        '00000000',     -- phone1 genérico
        '00000000',     -- phone2 genérico
        CURRENT_DATE,   -- fecha actual para apertura
        '00:00-00:00'  -- horario genérico
    )
    RETURNING branch_id INTO new_branch_id;

    RETURN new_branch_id;
END;
$$ LANGUAGE plpgsql;

-- ---------------------- sp_copy_spa_treatments ----------------------
CREATE OR REPLACE FUNCTION sp_copy_spa_treatments(
    original_branch_name TEXT,
    new_branch_name TEXT
)
RETURNS VOID AS $$
DECLARE
    original_branch_id INT;
    new_branch_id INT;
BEGIN
    -- Obtener branch_id de la sucursal original
    SELECT branch_id INTO original_branch_id FROM Branch WHERE name = original_branch_name;
    IF original_branch_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal original "%" no encontrada', original_branch_name;
    END IF;

    -- Obtener branch_id de la sucursal nueva
    SELECT branch_id INTO new_branch_id FROM Branch WHERE name = new_branch_name;
    IF new_branch_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal nueva "%" no encontrada', new_branch_name;
    END IF;

    -- Insertar asociaciones evitando duplicados
    INSERT INTO Spa_Treatment_Branch (treatment_id, branch_id)
    SELECT treatment_id, new_branch_id
    FROM Spa_Treatment_Branch
    WHERE branch_id = original_branch_id
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- ---------------------- sp_copy_store_and_products ----------------------
CREATE OR REPLACE FUNCTION sp_copy_store_and_products(
    old_branch_name TEXT,
    new_branch_name TEXT
)
RETURNS VOID AS $$
DECLARE
    old_branch_id INT;
    new_branch_id INT;
    old_store RECORD;
    new_store_id INT;
BEGIN
    -- Obtener branch_id de la sucursal original
    SELECT branch_id INTO old_branch_id FROM Branch WHERE name = old_branch_name;
    IF old_branch_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal original "%" no encontrada', old_branch_name;
    END IF;

    -- Obtener branch_id de la sucursal nueva
    SELECT branch_id INTO new_branch_id FROM Branch WHERE name = new_branch_name;
    IF new_branch_id IS NULL THEN
        RAISE EXCEPTION 'Sucursal nueva "%" no encontrada', new_branch_name;
    END IF;

    -- Obtener tienda original
    SELECT * INTO old_store FROM Store WHERE branch_id = old_branch_id;

    IF NOT FOUND THEN
        RAISE NOTICE 'No hay tienda para la sucursal original %', old_branch_id;
        RETURN;
    END IF;

    -- Insertar tienda nueva
    INSERT INTO Store (name, is_active, branch_id)
    VALUES (old_store.name, old_store.is_active, new_branch_id)
    RETURNING store_id INTO new_store_id;

    -- Copiar productos de la tienda original asignándolos a la nueva tienda
    INSERT INTO Product (name, cost, barcode, description, is_active, store_id)
    SELECT name, cost, barcode, description, is_active, new_store_id
    FROM Product
    WHERE store_id = old_store.store_id;
END;
$$ LANGUAGE plpgsql;


-- ---------------------- sp_copy_classes_by_branch_names ----------------------

CREATE OR REPLACE FUNCTION sp_copy_classes_by_branch_names(
    in_old_branch_name TEXT,
    in_new_branch_name TEXT
)
RETURNS VOID AS $$
DECLARE
    rec RECORD;
    old_branch_id INT;
    new_branch_id INT;
BEGIN
    -- Obtener IDs de sucursal por nombre
    SELECT branch_id INTO old_branch_id FROM Branch WHERE name = in_old_branch_name;
    IF old_branch_id IS NULL THEN
        RAISE EXCEPTION 'No existe la sucursal original: %', in_old_branch_name;
    END IF;

    SELECT branch_id INTO new_branch_id FROM Branch WHERE name = in_new_branch_name;
    IF new_branch_id IS NULL THEN
        RAISE EXCEPTION 'No existe la sucursal destino: %', in_new_branch_name;
    END IF;

    -- Recorrer todas las clases que pertenecen a empleados de la sucursal original
    FOR rec IN
        SELECT c.*
        FROM Class c
        JOIN Employee e ON c.employee_id = e.employee_id
        WHERE e.branch_id = old_branch_id
    LOOP
        -- Insertar clase nueva en la base, sin instructor, mismo plan_id
        INSERT INTO Class (type, is_group, max_capacity, date, start_time, end_time, plan_id, employee_id)
        VALUES (
            rec.type,
            rec.is_group,
            rec.max_capacity,
            rec.date,
            rec.start_time,
            rec.end_time,
            rec.plan_id,
            NULL  -- sin instructor asignado
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- ---------------------- sp_copy_inventory ----------------------
-- Copia el inventario de una sucursal a otra, manteniendo el mismo tipo de equipo.
-- Evita duplicados por número de serie.

CREATE OR REPLACE FUNCTION sp_copy_inventory(
    in_old_branch_name TEXT,
    in_new_branch_name TEXT
)
RETURNS VOID AS $$
DECLARE
    old_branch_id INT;
    new_branch_id INT;
    item RECORD;
BEGIN
    -- Obtener los IDs de las sucursales por nombre
    SELECT branch_id INTO old_branch_id FROM Branch WHERE name = in_old_branch_name;
    IF NOT FOUND THEN
        RAISE NOTICE 'Sucursal original % no encontrada', in_old_branch_name;
        RETURN;
    END IF;

    SELECT branch_id INTO new_branch_id FROM Branch WHERE name = in_new_branch_name;
    IF NOT FOUND THEN
        RAISE NOTICE 'Sucursal nueva % no encontrada', in_new_branch_name;
        RETURN;
    END IF;

    -- Iterar sobre cada equipo de la sucursal original
    FOR item IN
        SELECT * FROM Inventory WHERE branch_id = old_branch_id
    LOOP
        -- Insertar solo si el número de serie no existe ya en la sucursal nueva
        IF NOT EXISTS (
            SELECT 1 FROM Inventory
            WHERE serial_number = item.serial_number AND branch_id = new_branch_id
        ) THEN
            INSERT INTO Inventory (description, brand, serial_number, cost, equipment_type_id, branch_id)
            VALUES (
                item.description,
                item.brand,
                item.serial_number,
                item.cost,
                item.equipment_type_id,
                new_branch_id
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
