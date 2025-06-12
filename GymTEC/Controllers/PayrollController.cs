using GymTEC.Data_input_models.manage_payroll;
using GymTEC.Data_output_models.manage_payroll;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PayrollController : ControllerBase
    {
        [HttpPost("generate_payroll")]
        public ActionResult<Data_response<Data_output_generate_payroll>> GeneratePayroll([FromBody] Data_input_generate_payroll input)
        {
            // Simulamos la generación de planilla con datos ficticios
            var payrollData = new Data_output_generate_payroll
            {
                employees = new List<EmployeePayrollInfo>
                {
                    new EmployeePayrollInfo
                    {
                        id_number = "123456789",
                        full_name = "Juan Pérez",
                        classes_or_hours = 40,
                        amount_to_pay = 500.00m
                    },
                    new EmployeePayrollInfo
                    {
                        id_number = "987654321",
                        full_name = "María González",
                        classes_or_hours = 35,
                        amount_to_pay = 437.50m
                    }
                }
            };

            var response = new Data_response<Data_output_generate_payroll>
            {
                status = true,
                data = payrollData
            };

            return Ok(response);
        }
    }
}
