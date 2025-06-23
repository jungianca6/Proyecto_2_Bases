import React from "react";
import { Link } from "react-router-dom";
import styles from "./AdminPg.module.css";

function AdminPg() {
    const opciones = [
        { nombre: "Sucursales", ruta: "/admin/sucursal" },
        { nombre: "Tratamientos de spa", ruta: "/admin/tratamiento" },
        { nombre: "Puestos", ruta: "/admin/puesto" },
        { nombre: "Tipos de planilla", ruta: "/admin/tipos-planilla" },
        { nombre: "Empleados", ruta: "/admin/empleado" },
        { nombre: "Servicios", ruta: "/admin/servicio" },
        { nombre: "Tiendas", ruta: "/admin/tiendas" },
        { nombre: "Tipos de equipo", ruta: "/admin/equipo" },
        { nombre: "Inventario", ruta: "/admin/inventario" },
        { nombre: "Productos", ruta: "/admin/producto" },
        { nombre: "Configuración de gimnasio", ruta: "/admin/configuracion" },
        { nombre: "Generación de planilla", ruta: "/admin/generacion" },
        { nombre: "Copiar calendario de actividades", ruta: "/admin/calendario" },
        { nombre: "Copiar gimnasio", ruta: "/admin/copiar-gimnasio" }
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
