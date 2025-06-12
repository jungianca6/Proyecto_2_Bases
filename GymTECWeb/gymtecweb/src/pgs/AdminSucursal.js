import React from "react";
import styles from "./AdminPg.module.css"; 

function AdminSucursal() {
    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Sucursales</div>
            </nav>
            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Sucursales</h1>
                <p className={styles.description}>Aquí puede administrar las sucursales del gimnasio.</p>
            </main>
        </div>
    );
}

export default AdminSucursal;
