INSERT INTO Position (position_id, description, name) VALUES (1, 'Encargado de administración', 'Administrador');
INSERT INTO Position (position_id, description, name) VALUES (2, 'Encargado de clases de yoga', 'Instructor');
INSERT INTO Position (position_id, description, name) VALUES (3, 'Encargado del spa', 'Dependiente Spa');
INSERT INTO Position (position_id, description, name) VALUES (4, 'Encargado de la tienda', 'Dependiente tienda');

INSERT INTO Spreadsheet (spreadsheet_id, salary, position_id) VALUES (1, 500000, 1);
INSERT INTO Spreadsheet (spreadsheet_id, salary, position_id) VALUES (2, 450000, 2);
INSERT INTO Spreadsheet (spreadsheet_id, salary, position_id) VALUES (3, 600000, 3);

INSERT INTO Branch (branch_id, name, province, canton, district, email, phone1, phone2, opening_date, opening_hours) VALUES (1, 'Sucursal Central', 'San José', 'Montes de Oca', 'San Pedro', 'gymtec.sj@gmail.com', '22223333', '88887777', '2020-01-15', '5:00 - 18:00');
INSERT INTO Branch (branch_id, name, province, canton, district, email, phone1, phone2, opening_date, opening_hours) VALUES (2, 'Sucursal Cartago', 'Cartago', 'Cartago', 'La Lima', 'gymtec.c@gmail.com', '22445566', '88884444', '2021-06-01', '5:00 - 18:00');
INSERT INTO Branch (branch_id, name, province, canton, district, email, phone1, phone2, opening_date, opening_hours) VALUES (3, 'Sucursal Alajuela', 'Alajuela', 'Alajuela', 'La Trinidad', 'gymtec.a@gmail.com', '24556677', '89997777', '2022-03-10', '5:00 - 18:00');

INSERT INTO Store (store_id, name, is_active, branch_id) VALUES (1, 'Tienda Central', TRUE, 1);
INSERT INTO Store (store_id, name, is_active, branch_id) VALUES (2, 'Tienda Cartago', TRUE, 2);
INSERT INTO Store (store_id, name, is_active, branch_id) VALUES (3, 'Tienda Alajuela', FALSE, 3);

INSERT INTO Spa (spa_id, name, is_active, branch_id) VALUES (1, 'Spa Central', TRUE, 1);
INSERT INTO Spa (spa_id, name, is_active, branch_id) VALUES (2, 'Spa Cartago', FALSE, 2);
INSERT INTO Spa (spa_id, name, is_active, branch_id) VALUES (3, 'Spa Alajuela', TRUE, 3);

INSERT INTO Equipment_Type (equipment_type_id, name, description) VALUES (1, 'Cintas de correr', 'Máquina para correr');
INSERT INTO Equipment_Type (equipment_type_id, name, description) VALUES (2, 'Bicicletas estacionarias', 'Maquina para hacer bicicleta');
INSERT INTO Equipment_Type (equipment_type_id, name, description) VALUES (3, 'Multigimnasios', 'Diferentes tipos de maquinas y útiles');
INSERT INTO Equipment_Type (equipment_type_id, name, description) VALUES (4, 'Remos', 'Maquina para hacer remo');
INSERT INTO Equipment_Type (equipment_type_id, name, description) VALUES (5, 'Pesas', 'Diferentes tipos de pesas');

INSERT INTO Inventory (inventory_id, description, brand, serial_number, cost, equipment_type_id, branch_id) VALUES (1, 'Bicicleta Estática', 'ProGym', 'GYM123456', 450.0, 2, 1);
INSERT INTO Inventory (inventory_id, description, brand, serial_number, cost, equipment_type_id, branch_id) VALUES (2, 'Remo deslizante', 'ProGym', 'GYM123564', 450.0, 4, 1);
INSERT INTO Inventory (inventory_id, description, brand, serial_number, cost, equipment_type_id, branch_id) VALUES (3, 'Remo en polea', 'IronFit', 'WT2020', 300.0, 4, 1);
INSERT INTO Inventory (inventory_id, description, brand, serial_number, cost, equipment_type_id, branch_id) VALUES (4, 'Set de Pesas', 'IronFit', 'WT2024', 300.0, 5, 2);
INSERT INTO Inventory (inventory_id, description, brand, serial_number, cost, equipment_type_id, branch_id) VALUES (5, 'Bloques Yoga', 'ZenGear', 'YG101', 75.0, 3, 3);

INSERT INTO Work_Plan (plan_id, description, period, start_time, end_time, branch_id) VALUES (1, 'Plan de Mañana', 'Semanal', '08:00', '12:00', 1);
INSERT INTO Work_Plan (plan_id, description, period, start_time, end_time, branch_id) VALUES (2, 'Plan de Tarde', 'Semanal', '13:00', '17:00', 2);
INSERT INTO Work_Plan (plan_id, description, period, start_time, end_time, branch_id) VALUES (3, 'Plan Nocturno', 'Semanal', '18:00', '21:00', 3);

INSERT INTO Employee (employee_id, name, province, canton, district, email, id_number, password, salary, bank_account, position_id, spreadsheet_id, branch_id) VALUES (1, 'Laura Campos', 'San José', 'Goicoechea', 'Guadalupe', 'laura@gmail.com', '123456789', 'pw1', 500000, 'CR1234567890', 1, 1, 1);
INSERT INTO Employee (employee_id, name, province, canton, district, email, id_number, password, salary, bank_account, position_id, spreadsheet_id, branch_id) VALUES (2, 'Mario López', 'Cartago', 'Cartago', 'Cartago', 'mario@gmail.com.com', '987654321', 'pw2', 450000, 'CR0987654321', 2, 2, 2);
INSERT INTO Employee (employee_id, name, province, canton, district, email, id_number, password, salary, bank_account, position_id, spreadsheet_id, branch_id) VALUES (3, 'Ana Vargas', 'Alajuela', 'Alajuela', 'Alajuela', 'ana@gmail.com', '456123789', 'pw3', 600000, 'CR4567891230', 3, 3, 3);

INSERT INTO Class (class_id, type, is_group, max_capacity, date, start_time, end_time, plan_id, employee_id) VALUES (1, 'Indoor Cycling', TRUE, 15, '2025-06-15', '09:00', '10:30', 1, 1);
INSERT INTO Class (class_id, type, is_group, max_capacity, date, start_time, end_time, plan_id, employee_id) VALUES (2, 'Pilates', TRUE, 12, '2025-06-16', '13:00', '14:30', 2, 2);
INSERT INTO Class (class_id, type, is_group, max_capacity, date, start_time, end_time, plan_id, employee_id) VALUES (3, 'Yoga', FALSE, 10, '2025-06-17', '19:00', '20:00', 3, 3);
INSERT INTO Class (class_id, type, is_group, max_capacity, date, start_time, end_time, plan_id, employee_id) VALUES (4, 'Zumba', TRUE, 12, '2025-06-16', '13:00', '14:30', 2, 2);
INSERT INTO Class (class_id, type, is_group, max_capacity, date, start_time, end_time, plan_id, employee_id) VALUES (5, 'Natación', FALSE, 10, '2025-06-17', '19:00', '20:00', 3, 3);


INSERT INTO Service (service_id, description, class_id) VALUES (1, 'Indoor Cycling', 1);
INSERT INTO Service (service_id, description, class_id) VALUES (2, 'Pilates ', 2);
INSERT INTO Service (service_id, description, class_id) VALUES (3, 'Yoga', 3);
INSERT INTO Service (service_id, description, class_id) VALUES (4, 'Zumba ', 4);
INSERT INTO Service (service_id, description, class_id) VALUES (5, 'Natación', 5);

INSERT INTO Product (product_id, name, cost, barcode, description, is_active, store_id) VALUES (1, 'Colchoneta Yoga', 10000, 'YOGA001', 'Esterilla antideslizante', TRUE, 1);
INSERT INTO Product (product_id, name, cost, barcode, description, is_active, store_id) VALUES (2, 'Botella Deportiva', 8000, 'BOT002', 'Botella de agua reutilizable', TRUE, 2);
INSERT INTO Product (product_id, name, cost, barcode, description, is_active, store_id) VALUES (3, 'Proteina UltraProMax', 25000, 'TOA003', 'Toalla absorbente y ligera', FALSE, 3);

INSERT INTO Client (client_id, name, email, address, phone, password, birth_date, weight) VALUES (1, 'Carlos Méndez', 'carlos@gmail.com', 'San Pedro', '89998888', 'pwC1', '1990-04-12', 72.5);
INSERT INTO Client (client_id, name, email, address, phone, password, birth_date, weight) VALUES (2, 'Lucía Ramírez', 'lucia@gmail.com', 'Cartago', '87875555', 'pwC2', '1985-02-20', 68.0);
INSERT INTO Client (client_id, name, email, address, phone, password, birth_date, weight) VALUES (3, 'José Fernández', 'jose@gmail.com', 'Alajuela', '85443322', 'pwC3', '1992-08-30', 80.3);

INSERT INTO Spa_Treatment (treatment_id, name, description) VALUES (1, 'Masaje Relajante', 'Masaje para reducir el estrés');
INSERT INTO Spa_Treatment (treatment_id, name, description) VALUES (2, 'Masaje descarga muscular', 'Masaje para calmar los músculos');
INSERT INTO Spa_Treatment (treatment_id, name, description) VALUES (3, 'Sauna', 'Ayuda a sudar');
INSERT INTO Spa_Treatment (treatment_id, name, description) VALUES (4, 'Baño a vapor', 'Relajación ');

INSERT INTO Product_Store (product_id, store_id, quantity, entry_date) VALUES (1, 1, 30, '2025-06-10');
INSERT INTO Product_Store (product_id, store_id, quantity, entry_date) VALUES (2, 2, 40, '2025-06-11');
INSERT INTO Product_Store (product_id, store_id, quantity, entry_date) VALUES (3, 3, 20, '2025-06-12');

INSERT INTO Class_Attendance (client_id, class_id, date, time) VALUES (1, 1, '2025-06-15', '09:00');
INSERT INTO Class_Attendance (client_id, class_id, date, time) VALUES (2, 2, '2025-06-16', '13:00');
INSERT INTO Class_Attendance (client_id, class_id, date, time) VALUES (3, 3, '2025-06-17', '19:00');

INSERT INTO Client_Treatment (client_id, treatment_id, date, time) VALUES (1, 1, '2025-06-14', '16:00');
INSERT INTO Client_Treatment (client_id, treatment_id, date, time) VALUES (2, 2, '2025-06-15', '17:00');
INSERT INTO Client_Treatment (client_id, treatment_id, date, time) VALUES (3, 3, '2025-06-16', '18:00');