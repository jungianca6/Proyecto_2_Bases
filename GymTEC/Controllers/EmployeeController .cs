using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_employee;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_employee;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public EmployeeController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        /// <summary>
        /// Inserta un nuevo empleado o edita un empleado existente en el sistema.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_employee que contiene la información del empleado:
        /// - employee_id
        /// - full_name
        /// - province
        /// - canton
        /// - district
        /// - position
        /// - branch
        /// - payroll_type
        /// - salary
        /// - email
        /// - password
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con la información del empleado insertado o actualizado.
        /// - status = true si la operación es exitosa.
        /// - data = objeto Data_output_employee con la información del empleado.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El employee_id debe ser único al insertar.
        /// - Para editar, el employee_id debe existir previamente.
        /// </remarks>
        [HttpPost("insert_or_edit")]
        public ActionResult<Data_response<Data_output_employee>> InsertOrEditEmployee([FromBody] Data_input_employee input)
        {
            // Aquí iría la lógica para insertar o editar en base a input.employee_id

            var data_output = new Data_output_employee
            {
                employee_id = input.employee_id,
                full_name = input.full_name,
                province = input.province,
                district = input.district,
                canton = input.canton,
                position = input.position,
                branch = input.branch,
                payroll_type = input.payroll_type,
                salary = input.salary,
                email = input.email,
                password = input.password
            };

            var response = new Data_response<Data_output_employee>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }

        /// <summary>
        /// Elimina un empleado del sistema.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_employee que contiene:
        /// - employee_id del empleado a eliminar.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con un mensaje de confirmación.
        /// - status = true si la operación es exitosa.
        /// - data = mensaje de texto.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El employee_id debe existir previamente en el sistema.
        /// </remarks>
        [HttpPost("delete")]
        public ActionResult<Data_response<string>> DeleteEmployee([FromBody] Data_input_employee input)
        {
            // Aquí iría la lógica para eliminar en base a input.employee_id

            var response = new Data_response<string>
            {
                status = true,
                data = "Empleado eliminado exitosamente"
            };

            return Ok(response);
        }

        /// <summary>
        /// Consulta la información de un empleado específico.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_employee que contiene:
        /// - employee_id del empleado a consultar.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con la información del empleado.
        /// - status = true si la operación es exitosa.
        /// - data = objeto Data_output_employee con la información del empleado.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El employee_id debe existir previamente en el sistema.
        /// - Si no existe, se debería devolver status = false (no implementado aquí porque es un mock).
        /// </remarks>
        [HttpPost("get")]
        public ActionResult<Data_response<Data_output_employee>> GetEmployee([FromBody] Data_input_employee input)
        {
            // Aquí iría la lógica para consultar el empleado por input.employee_id

            // Ejemplo ficticio de respuesta:
            var data_output = new Data_output_employee
            {
                employee_id = input.employee_id,
                full_name = "Juan Pérez González",
                province = "San José",
                canton = "Escazú",
                district = "San Rafael",
                position = "Entrenador Personal",
                branch = "Sucursal Escazú",
                payroll_type = "Mensual",
                salary = 650000,
                email = "juan.perez@example.com",
                password = "contraseñaSegura123"
            };

            var response = new Data_response<Data_output_employee>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }
    }
}