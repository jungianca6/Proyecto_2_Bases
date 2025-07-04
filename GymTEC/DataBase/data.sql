-- 1. Table Position
CREATE TABLE Position (
    position_id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
	name VARCHAR(100) NOT NULL
);

-- 2. Table Spreadsheet
CREATE TABLE Spreadsheet (
    spreadsheet_id SERIAL PRIMARY KEY,
    position_id INT NOT NULL REFERENCES Position(position_id),
	hours_worked INT,
	classes_taught INT,
	hourly_rate INT,
	class_rate INT,
	description TEXT
);

-- 3. Table Branch
CREATE TABLE Branch (
    branch_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    province VARCHAR(200) NOT NULL,
	canton VARCHAR(200) NOT NULL,
	district VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,	
    phone1 VARCHAR(20) NOT NULL,
	phone2 VARCHAR(20) NOT NULL,
    opening_date DATE NOT NULL,
    opening_hours VARCHAR(100) NOT NULL
);

-- 4. Table Store
CREATE TABLE Store (
    store_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL,
    branch_id INT NOT NULL REFERENCES Branch(branch_id)
);

-- 5. Table Spa
CREATE TABLE Spa (
    spa_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL,
    branch_id INT NOT NULL REFERENCES Branch(branch_id)
);

-- 6. Table Equipment_Type
CREATE TABLE Equipment_Type (
    equipment_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL
);

-- 7. Table Inventory
CREATE TABLE Inventory (
    inventory_id SERIAL PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    cost NUMERIC(10,2) NOT NULL,
    equipment_type_id INT NOT NULL REFERENCES Equipment_Type(equipment_type_id),
    branch_id INT NOT NULL REFERENCES Branch(branch_id)
);

-- 8. Table Work_Plan
CREATE TABLE Work_Plan (
    plan_id SERIAL PRIMARY KEY,
	day VARCHAR(200),
	exercise_name VARCHAR(200),
    period VARCHAR(50),
	notes TEXT,
	sets INT,
	repetitions INT,
    client_id INT NOT NULL REFERENCES Client(client_id)
);



-- 9. Table Employee
CREATE TABLE Employee (
    employee_id TEXT PRIMARY KEY,               -- número de cédula del empleado
    name VARCHAR(100) NOT NULL,
    province VARCHAR(200) NOT NULL,
    canton VARCHAR(200) NOT NULL,
    district VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,            
    password VARCHAR(100) NOT NULL,
    salary INT NOT NULL,
    position_id INT NOT NULL REFERENCES Position(position_id),
    spreadsheet_id INT NOT NULL REFERENCES Spreadsheet(spreadsheet_id),
    branch_id INT NOT NULL REFERENCES Branch(branch_id)
);


-- 10. Table Class
CREATE TABLE Class (
    class_id PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    is_group BOOLEAN NOT NULL,
    max_capacity INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    plan_id INT NOT NULL REFERENCES Work_Plan(plan_id),
    employee_id INT REFERENCES Employee(employee_id)
);

-- 11. Table Service
CREATE TABLE Service (
    service_id SERIAL PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    class_id INT NOT NULL REFERENCES Class(class_id)
);

-- 12. Table Product
CREATE TABLE Product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cost NUMERIC(10,2) NOT NULL,
    barcode VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    is_active BOOLEAN NOT NULL,
    store_id INT NOT NULL REFERENCES Store(store_id)
);

-- 13. Table Client
CREATE TABLE Client (
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    weight INT NOT NULL,
    username VARCHAR(100) NOT NULL
    -- Age and BMI are derived attributes, NOT stored
);

-- 14. Table Spa_Treatment
CREATE TABLE Spa_Treatment (
    treatment_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL
);

-- Product - Store
CREATE TABLE Product_Store (
    product_id INT NOT NULL REFERENCES Product(product_id),
    store_id INT NOT NULL REFERENCES Store(store_id),
    quantity INT,
    entry_date DATE,
    PRIMARY KEY (product_id, store_id)
);

-- Client - Class (Class_Attendance)
CREATE TABLE Class_Attendance (
    client_id INT NOT NULL REFERENCES Client(client_id),
    class_id INT NOT NULL REFERENCES Class(class_id),
    date DATE NOT NULL,
    time TIME,
    PRIMARY KEY (client_id, class_id, date)
);

-- Client - Spa_Treatment (Client_Treatment)
CREATE TABLE Client_Treatment (
    client_id INT NOT NULL REFERENCES Client(client_id),
    treatment_id INT NOT NULL REFERENCES Spa_Treatment(treatment_id),
    date DATE NOT NULL,
    time TIME,
    PRIMARY KEY (client_id, treatment_id, date)
);

CREATE TABLE Admin (
	admin_id SERIAL PRIMARY KEY,
	username VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL
)

-- Branch - Spa_Treatment (Spa_Treatment--Branch)
CREATE TABLE Spa_Treatment_Branch (
    treatment_id INT NOT NULL,
    branch_id INT NOT NULL,
    PRIMARY KEY (treatment_id, branch_id),
    FOREIGN KEY (treatment_id) REFERENCES Spa_Treatment(treatment_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES Branch(branch_id) ON DELETE CASCADE
);


-- Client - Product (Insert or Edit)
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
