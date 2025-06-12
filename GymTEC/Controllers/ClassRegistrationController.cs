using GymTEC.Data_input_models.manage_class;
using GymTEC.Data_output_models.manage_class;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClassRegistrationController : ControllerBase
    {
        [HttpPost("register_class")]
        public ActionResult<Data_response<Data_output_register_class>> RegisterClass([FromBody] Data_input_register_class input)
        {
            // Aquí iría la lógica real para registrar la clase (base de datos, validaciones, etc.)

            var response = new Data_response<Data_output_register_class>
            {
                status = true,
                data = new Data_output_register_class
                {
                    message = "Clase registrada exitosamente"
                }
            };

            return Ok(response);
        }
    }
}
