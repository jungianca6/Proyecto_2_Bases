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
        [HttpPost("insert")]
        public ActionResult<Data_response<Data_output_employee>> InsertOrEditEmployee([FromBody] Data_input_employee input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_employee_id", input.employee_id },
        { "in_full_name", input.full_name },
        { "in_province", input.province },
        { "in_canton", input.canton },
        { "in_district", input.district },
        { "in_position", input.position },
        { "in_branch", input.branch },
        { "in_payroll_id", input.payroll_id }, // ID en vez de nombre
        { "in_salary", input.salary },
        { "in_email", input.email },
        { "in_password", input.password }
    };

            try
            {
                _databaseService.ExecuteFunction(
                    "SELECT sp_insert_or_edit_employee(@in_employee_id, @in_full_name, @in_province, @in_canton, @in_district, @in_position, @in_branch, @in_payroll_id, @in_salary, @in_email, @in_password)",
                    parameters
                );

                var data_output = new Data_output_employee
                {
                    employee_id = input.employee_id,
                    full_name = input.full_name,
                    province = input.province,
                    canton = input.canton,
                    district = input.district,
                    position = input.position,
                    branch = input.branch,
                    payroll_id = input.payroll_id,
                    salary = input.salary,
                    email = input.email,
                    password = input.password
                };

                return Ok(new Data_response<Data_output_employee>
                {
                    status = true,
                    data = data_output
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }


        [HttpPost("edit_employee")]
        public ActionResult<Data_response<string>> EditEmployee([FromBody] Data_input_employee input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_id_number", input.employee_id },
        { "in_full_name", input.full_name },
        { "in_province", input.province },
        { "in_canton", input.canton },
        { "in_district", input.district },
        { "in_position", input.position },
        { "in_branch", input.branch },
        { "in_payroll_id", input.payroll_id }, // ID directo
        { "in_salary", input.salary },
        { "in_email", input.email },
        { "in_password", input.password }
    };

            try
            {
                _databaseService.ExecuteFunction(
                    "SELECT sp_edit_employee(@in_id_number, @in_full_name, @in_province, @in_canton, @in_district, @in_position, @in_branch, @in_payroll_id, @in_salary, @in_email, @in_password)",
                    parameters
                );

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = "Empleado editado exitosamente."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }



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
                payroll_id = 1,
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