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




