import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pgs/Login";
import AdminPg from "./pgs/Admin/AdminPg";
import ClientePg from "./pgs/ClientePg";
import InstructorPg from "./pgs/InstructorPg";
import AdminSucursal from "./pgs/Admin/AdminSucursal";
import AdminTratamiento from "./pgs/Admin/AdminTratamiento";
import AdminPuesto from "./pgs/Admin/AdminPuesto";
import AdminTiposP from "./pgs/Admin/AdminTiposP";
import AdminEmpleado from "./pgs/Admin/AdminEmpleado";
import AdminServicio from "./pgs/Admin/AdminServicio";
import AdminEquipo from "./pgs/Admin/AdminEquipo";
import AdminInventario from "./pgs/Admin/AdminInventario";
import AdminProducto from "./pgs/Admin/AdminProducto";
import AdminGeneracion from "./pgs/Admin/AdminGeneracion";
import AdminCalendario from "./pgs/Admin/AdminCalendario";
import AdminCG from "./pgs/Admin/AdminCG";
import AdminConfiguracion from "./pgs/Admin/AdminConfiguracion";
import AdminAsociacionTratamiento from "./pgs/Admin/AdminAsociacionTratamiento";
import AdminAsociacionInventario from "./pgs/Admin/AdminAsociacionInventario";
import AdminAsociacionProducto from "./pgs/Admin/AdminAsociacionProducto";
import AdminCreacionClases from "./pgs/Admin/AdminCreacionClases";

import 'bootstrap/dist/css/bootstrap.min.css';

import ClienteBusquedaClase from "./pgs/ClienteBusquedaClase";


function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setUser={setUser} />} />
                
                <Route path="/admin" element={user?.rol === "Admin" ? <AdminPg /> : <Navigate to="/login" />} />
                <Route path="/admin/sucursal" element={user?.rol === "Admin" ? <AdminSucursal /> : <Navigate to="/login" />} />
                <Route path="/admin/tratamiento" element={user?.rol === "Admin" ? <AdminTratamiento /> : <Navigate to="/login" />} />
                <Route path="/admin/puesto" element={user?.rol === "Admin" ? <AdminPuesto /> : <Navigate to="/login" />} />
                <Route path="/admin/tipos-planilla" element={user?.rol === "Admin" ? <AdminTiposP /> : <Navigate to="/login" />} /> 
                <Route path="/admin/empleado" element={user?.rol === "Admin" ? <AdminEmpleado /> : <Navigate to="/login" />} />
                <Route path="/admin/servicio" element={user?.rol === "Admin" ? <AdminServicio /> : <Navigate to="/login" />} />
                <Route path="/admin/equipo" element={user?.rol === "Admin" ? <AdminEquipo /> : <Navigate to="/login" />} />
                <Route path="/admin/inventario" element={user?.rol === "Admin" ? <AdminInventario /> : <Navigate to="/login" />} />
                <Route path="/admin/producto" element={user?.rol === "Admin" ? <AdminProducto /> : <Navigate to="/login" />} />
                <Route path="/admin/generacion" element={user?.rol === "Admin" ? <AdminGeneracion /> : <Navigate to="/login" />} />

                <Route path="/admin/calendario" element={user?.rol === "Admin" ? <AdminCalendario /> : <Navigate to="/login" />} />
                <Route path="/admin/copiar-gimnasio" element={user?.rol === "Admin" ? <AdminCG /> : <Navigate to="/login" />} />
                <Route path="/admin/configuracion" element={user?.rol === "Admin" ? <AdminConfiguracion /> : <Navigate to="/login" />} />

                <Route path="/admin/configuracion/asociaciontratamiento"
                       element={user?.rol === "Admin" ? <AdminAsociacionTratamiento /> : <Navigate to="/login" />} />
                <Route path="/admin/configuracion/asociacioninventario"
                       element={user?.rol === "Admin" ? <AdminAsociacionInventario /> : <Navigate to="/login" />} />
                <Route path="/admin/configuracion/asociacionproducto"
                       element={user?.rol === "Admin" ? <AdminAsociacionProducto /> : <Navigate to="/login" />} />
                <Route path="/admin/configuracion/creacionclases"
                       element={user?.rol === "Admin" ? <AdminCreacionClases /> : <Navigate to="/login" />} />



                <Route path="/cliente" element={user?.rol === "Cliente" ? <ClientePg /> : <Navigate to="/login" />} />
                <Route path="/cliente/busquedaclase" element={user?.rol === "Cliente" ? <ClienteBusquedaClase /> : <Navigate to="/login" />} />
                <Route path="/cliente/registroclase" element={user?.rol === "Cliente" ? <ClientePg /> : <Navigate to="/login" />} />
                <Route path="/cliente/plantrabajo" element={user?.rol === "Cliente" ? <ClientePg /> : <Navigate to="/login" />} />


                <Route path="/instructor" element={user?.rol === "Instructor" ? <InstructorPg /> : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
