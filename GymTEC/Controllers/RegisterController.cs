using GymTEC.Data_input_models;
using GymTEC.Data_output_models;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegisterController : ControllerBase
    {

        [HttpPost("register_client")]
        public ActionResult<Data_response<Data_output_register_client>> RegisterClient([FromBody] Data_input_register_client input) 
        {
            Data_output_register_client data_Output = new Data_output_register_client();

            var response = new Data_response<Data_output_register_client>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);

        }
    }
}