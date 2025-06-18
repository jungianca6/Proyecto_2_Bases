
-- Triggers: 

CREATE OR REPLACE FUNCTION protect_default_treatments()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.treatment_id IN (1, 2, 3, 4) THEN
        RAISE EXCEPTION 'No se puede eliminar o modificar un tratamiento predeterminado.';
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
    IF OLD.position_id IN (1, 2, 3, 4) THEN
        RAISE EXCEPTION 'No se puede eliminar o modificar un puesto predeterminado.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_default_positions
BEFORE DELETE OR UPDATE ON Position
FOR EACH ROW
EXECUTE FUNCTION protect_default_positions();


-- Crear la función del trigger para proteger servicios default
CREATE OR REPLACE FUNCTION protect_default_services()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.service_id IN (1, 2, 3, 4, 5) THEN
        RAISE EXCEPTION 'No se puede eliminar o modificar un servicio predeterminado.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_default_services
BEFORE DELETE OR UPDATE ON Service
FOR EACH ROW
EXECUTE FUNCTION protect_default_services();

