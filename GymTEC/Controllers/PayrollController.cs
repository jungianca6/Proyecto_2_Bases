using GymTEC.Data_input_models.manage_payroll;
using GymTEC.Data_output_models.manage_payroll;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PayrollController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public PayrollController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost("generate_payroll")]
        public ActionResult<Data_response<Data_output_generate_payroll>> GeneratePayroll([FromBody] Data_input_generate_payroll input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_branch_name", input.branch_name }
    };

            try
            {
                var result = _databaseService.Query2<EmployeePayrollInfo>(
                    "SELECT * FROM sp_generate_payroll(@in_branch_name)", parameters);

                var data_output = new Data_output_generate_payroll
                {
                    employees = result.ToList()
                };

                return Ok(new Data_response<Data_output_generate_payroll>
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

        [HttpPost("manage_payroll_type")]
        public ActionResult<Data_response<string>> ManagePayrollType([FromBody] Data_input_manage_payroll_type input)
        {
            // Aquí la lógica para insertar o editar el tipo de planilla (simulación)
            string msg = $"Tipo de planilla '{input.description}' con ID '{input.identifier}' guardado correctamente.";

            return Ok(new Data_response<string>
            {
                status = true,
                data = msg
            });
        }

        [HttpPost("delete_payroll_type")]
        public ActionResult<Data_response<string>> DeletePayrollType([FromBody] Data_input_delete_payroll_type input)
        {
            // Aquí iría la lógica real de eliminación en base al identificador

            string msg = $"Tipo de planilla con ID '{input.identifier}' eliminado correctamente.";

            return Ok(new Data_response<string>
            {
                status = true,
                data = msg
            });
        }

        [HttpPost("get_payroll_type")]
        public ActionResult<Data_response<Data_output_get_payroll_type>> GetPayrollType([FromBody] Data_input_get_payroll_type input)
        {
            // Simulación de búsqueda (en la práctica, consultar en base de datos)
            var result = new Data_output_get_payroll_type
            {
                identifier = input.identifier,
                description = "Planilla de Entrenadores"
            };

            return Ok(new Data_response<Data_output_get_payroll_type>
            {
                status = true,
                data = result
            });
        }
    }
}
