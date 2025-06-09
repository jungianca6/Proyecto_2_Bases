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