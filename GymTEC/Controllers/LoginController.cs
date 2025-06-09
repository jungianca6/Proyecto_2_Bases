using GymTEC.Data_input_models;
using GymTEC.Data_output_models;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {

        [HttpPost("log_in")]
        public ActionResult<Data_response<Data_output_log_in>> LogIn([FromBody] Data_input_log_in input)
        {

            Data_output_log_in data_Output = new Data_output_log_in();

            var response = new Data_response<Data_output_log_in>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }
    }
}