
-- Triggers: 
CREATE OR REPLACE FUNCTION protect_default_treatments()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.name IN ('Masaje Relajante', 'Masaje descarga muscular', 'Sauna', 'Baño a vapor') THEN
        RAISE EXCEPTION 'No se puede eliminar o modificar un tratamiento predeterminado: %.', OLD.name;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_default_treatments
BEFORE DELETE OR UPDATE ON Spa_Treatment
FOR EACH ROW
EXECUTE FUNCTION protect_default_treatments();


-- Crear la función del trigger para proteger puestos default
CREATE OR REPLACE FUNCTION protect_default_positions()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.name IN ('Administrador', 'Instructor', 'Dependiente Spa', 'Dependiente tienda') THEN
        RAISE EXCEPTION 'No se puede eliminar o modificar un puesto predeterminado: %.', OLD.name;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_default_positions
BEFORE DELETE OR UPDATE ON Position
FOR EACH ROW
EXECUTE FUNCTION protect_default_positions();


-- Crear la función del trigger para proteger servicios default
CREATE OR REPLACE FUNCTION protect_default_branches()
RETURNS TRIGGER AS $$
BEGIN
    IF TRIM(OLD.name) IN ('Sucursal Central', 'Sucursal Cartago', 'Sucursal Heredia') THEN
        RAISE EXCEPTION 'No se puede eliminar o modificar una sucursal predeterminada: %.', OLD.name;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_default_branches
BEFORE DELETE OR UPDATE ON Branch
FOR EACH ROW
EXECUTE FUNCTION protect_default_branches();
