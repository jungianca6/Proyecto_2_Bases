import React, { useState } from "react";
import styles from "./AdminPg.module.css";

function AdminSucursal() {
    const [formData, setFormData] = useState({
        nombre: "",
        provincia: "",
        canton: "",
        distrito: "",
        fechaApertura: "",
        horario: "",
        administrador: "",
        capacidad: "",
        telefono1: "",
        telefono2: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        console.log(`Acción: ${accion}`);
        console.log(formData);
        // Aquí va el fetch al backend según el tipo de acción
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Sucursales</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Sucursales</h1>
                <form className={styles.form}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        {/* Columna izquierda */}
                        <div>
                        <label htmlFor="nombre" className={styles.label}>Nombre de la sucursal</label>
                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="provincia" className={styles.label}>Provincia</label>
                        <input type="text" id="provincia" name="provincia" value={formData.provincia} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="canton" className={styles.label}>Cantón</label>
                        <input type="text" id="canton" name="canton" value={formData.canton} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="distrito" className={styles.label}>Distrito</label>
                        <input type="text" id="distrito" name="distrito" value={formData.distrito} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="fechaApertura" className={styles.label}>Fecha de apertura</label>
                        <input type="date" id="fechaApertura" name="fechaApertura" value={formData.fechaApertura} onChange={handleChange} style={{ marginBottom: "1rem" }} />
                        </div>

                        {/* Columna derecha */}
                        <div>
                        <label htmlFor="horario" className={styles.label}>Horario de atención</label>
                        <input type="text" id="horario" name="horario" value={formData.horario} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="administrador" className={styles.label}>Empleado administrador</label>
                        <input type="text" id="administrador" name="administrador" value={formData.administrador} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="capacidad" className={styles.label}>Capacidad máxima</label>
                        <input type="number" id="capacidad" name="capacidad" value={formData.capacidad} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="telefono1" className={styles.label}>Teléfono 1</label>
                        <input type="tel" id="telefono1" name="telefono1" value={formData.telefono1} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="telefono2" className={styles.label}>Teléfono 2</label>
                        <input type="tel" id="telefono2" name="telefono2" value={formData.telefono2} onChange={handleChange} style={{ marginBottom: "1rem" }} />
                        </div>
                    </div>

                    <div className={styles.buttonRow} style={{ marginTop: "2rem" }}>
                        <button type="button" onClick={() => handleSubmit("insertar")}>Insertar</button>
                        <button type="button" onClick={() => handleSubmit("editar")}>Editar</button>
                        <button type="button" onClick={() => handleSubmit("eliminar")}>Eliminar</button>
                        <button type="button" onClick={() => handleSubmit("consultar")}>Consultar</button>
                    </div>
                    </form>

            </main>
        </div>
    );
}

export default AdminSucursal;
