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
                    { "in_branch_name", input.branch_name },
                    { "in_description", input.description } // aunque no se devuelva, puede usarse internamente
                };

            try
            {
                var result = _databaseService.Query2<EmployeePayrollInfo>(
                    "SELECT * FROM sp_generate_payroll(@in_branch_name, @in_description)", parameters);

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
            var parameters = new Dictionary<string, object>
                {
                    { "in_description", input.description },
                    { "in_puesto", input.puesto },
                    { "in_hourly_rate", input.hourly_payment },
                    { "in_class_rate", input.group_class_payment },
                    { "in_monthly_payment", input.monthly_payment }
                };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_manage_payroll_type(@in_description, @in_puesto, @in_hourly_rate, @in_class_rate, @in_monthly_payment)", parameters);

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = $"Tipo de planilla '{input.puesto}' gestionado correctamente."
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

        [HttpPost("delete_payroll_type")]
        public ActionResult<Data_response<string>> DeletePayrollType([FromBody] Data_input_delete_payroll_type input)
        {
            try
            {
                var parameters = new Dictionary<string, object>
        {
            { "in_puesto", input.puesto }
        };

                _databaseService.ExecuteFunction("SELECT sp_delete_payroll_type(@in_puesto)", parameters);

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = $"Tipo de planilla con puesto '{input.puesto}' eliminado correctamente."
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

        [HttpPost("get_payroll_type")]
        public ActionResult<Data_response<Data_output_get_payroll_type>> GetPayrollType([FromBody] Data_input_get_payroll_type input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_position_name", input.puesto }
    };

            try
            {
                var result = _databaseService.QuerySingle<Data_output_get_payroll_type>(
                    "SELECT name AS puesto, description FROM Position WHERE name = @in_position_name",
                    parameters
                );

                return Ok(new Data_response<Data_output_get_payroll_type>
                {
                    status = true,
                    data = result
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
    }
}
