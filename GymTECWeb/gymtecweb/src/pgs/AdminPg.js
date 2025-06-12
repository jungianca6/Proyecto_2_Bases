import React from "react";
import { Link } from "react-router-dom";
import styles from "./AdminPg.module.css";

function AdminPg() {
    const opciones = [
        { nombre: "Sucursales", ruta: "/admin/sucursal" },
        { nombre: "Tratamientos de spa", ruta: "/admin/tratamiento" },
        { nombre: "Puestos", ruta: "/admin/puesto" },
        { nombre: "Tipos de planilla" },
        { nombre: "Empleados" },
        { nombre: "Servicios" },
        { nombre: "Tipos de equipo" },
        { nombre: "Inventario" },
        { nombre: "Productos" },
        { nombre: "Configuración de gimnasio" },
        { nombre: "Generación de planilla" },
        { nombre: "Copiar calendario de actividades" },
        { nombre: "Copiar gimnasio" }
    ];

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Administrador</div>
                <ul className={styles.navList}>
                    {opciones.map((opcion, index) => (
                        <li key={index} className={styles.navItem}>
                            {opcion.ruta ? (
                                <Link to={opcion.ruta} className={styles.navLink}>
                                    {opcion.nombre}
                                </Link>
                            ) : (
                                <span className={styles.navLink}>{opcion.nombre}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Bienvenido, Administrador</h1>
                <p className={styles.description}>Seleccione una opción del menú.</p>
            </main>
        </div>
    );
}

export default AdminPg;
