import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pgs/Login";
import AdminPg from "./pgs/AdminPg";
import ClientePg from "./pgs/ClientePg";
import InstructorPg from "./pgs/InstructorPg";
import AdminSucursal from "./pgs/AdminSucursal";
import AdminTratamiento from "./pgs/AdminTratamiento";
import AdminPuesto from "./pgs/AdminPuesto";
import AdminTiposP from "./pgs/AdminTiposP";


import 'bootstrap/dist/css/bootstrap.min.css';

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

                <Route path="/cliente" element={user?.rol === "Cliente" ? <ClientePg /> : <Navigate to="/login" />} />
                <Route path="/instructor" element={user?.rol === "Instructor" ? <InstructorPg /> : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
