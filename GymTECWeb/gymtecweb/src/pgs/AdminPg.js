import React from "react";
import styles from "./AdminPg.module.css";

function AdminPg() {
    const opciones = [
        "Sucursales", "Tratamientos de spa", "Puestos", "Tipos de planilla",
        "Empleados", "Servicios", "Tipos de equipo", "Inventario",
        "Productos", "Configuración de gimnasio", "Generación de planilla",
        "Copiar calendario de actividades", "Copiar gimnasio"
    ];

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Administrador</div>
                <ul className={styles.navList}>
                    {opciones.map((opcion, index) => (
                        <li key={index} className={styles.navItem}>
                            <a href="#" className={styles.navLink}>
                                {opcion}
                            </a>
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
