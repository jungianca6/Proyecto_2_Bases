import React, { useState } from "react";
import styles from "./AdminPg.module.css";

function AdminEmpleado() {
    const [formData, setFormData] = useState({
        cedula: "",
        nombre: "",
        provincia: "",
        canton: "",
        distrito: "",
        puesto: "",
        sucursal: "",
        planilla: "",
        salario: "",
        correo: "",
        contrasena: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        console.log(`Acción: ${accion}`);
        console.log(formData);
        // Aquí va el fetch al backend
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Empleados</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Empleados</h1>
                <form className={styles.form}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        {/* Columna izquierda */}
                        <div>
                            <label htmlFor="cedula" className={styles.label}>Número de cédula</label>
                            <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="nombre" className={styles.label}>Nombre completo</label>
                            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="provincia" className={styles.label}>Provincia</label>
                            <input type="text" id="provincia" name="provincia" value={formData.provincia} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="canton" className={styles.label}>Cantón</label>
                            <input type="text" id="canton" name="canton" value={formData.canton} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="distrito" className={styles.label}>Distrito</label>
                            <input type="text" id="distrito" name="distrito" value={formData.distrito} onChange={handleChange} style={{ marginBottom: "1rem" }} />
                        </div>

                        {/* Columna derecha */}
                        <div>
                            <label htmlFor="puesto" className={styles.label}>Puesto que desempeña</label>
                            <input type="text" id="puesto" name="puesto" value={formData.puesto} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="sucursal" className={styles.label}>Sucursal asignada</label>
                            <input type="text" id="sucursal" name="sucursal" value={formData.sucursal} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="planilla" className={styles.label}>Tipo de planilla</label>
                            <input type="text" id="planilla" name="planilla" value={formData.planilla} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="salario" className={styles.label}>Salario</label>
                            <input type="number" id="salario" name="salario" value={formData.salario} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="correo" className={styles.label}>Correo electrónico</label>
                            <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="contrasena" className={styles.label}>Contraseña</label>
                            <input type="password" id="contrasena" name="contrasena" value={formData.contrasena} onChange={handleChange} style={{ marginBottom: "1rem" }} />
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

export default AdminEmpleado;
