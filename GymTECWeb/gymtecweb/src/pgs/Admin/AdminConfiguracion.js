import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminPg.module.css";

function AdminConfiguracion() {

    const opciones = [
        {nombre: "Asociación de tratamientos de spa", ruta: "/admin/configuracion/asociaciontratamiento"},
        {nombre: "Asociación de inventario", ruta: "/admin/configuracion/asociacioninventario"},
        {nombre: "Asociación de productos", ruta: "/admin/configuracion/asociacionproducto"},
        {nombre: "Creación de clases", ruta: "/admin/configuracion/creacionclases"},
    ];

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Administrador</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Configuración del gimnasio</h1>

                {/* Nueva sección con los botones centrados */}
                <div className={styles.centerButtons}>
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
                </div>
            </main>
        </div>
    );
}
export default AdminConfiguracion;
