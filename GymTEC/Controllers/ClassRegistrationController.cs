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

        private readonly DatabaseService _databaseService;

        public ClassRegistrationController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }


        [HttpPost("register_class")]
        public ActionResult<Data_response<Data_output_register_class>> RegisterClass([FromBody] Data_input_register_class input)
        {
            var parameters = new Dictionary<string, object>
                {
                    { "in_client_id", input.client_id },
                    { "in_class_date", input.class_date },      // "YYYY-MM-DD"
                    { "in_start", input.start_time },           // "HH:MM:SS"
                    { "in_end", input.end_time },
                    { "in_instructor_name", input.instructor },
                    { "in_available_spots", input.available_spots.ToString() }
                };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_register_class(@in_client_id, @in_class_date, @in_start, @in_end, @in_instructor_name, @in_available_spots)", parameters);

                return Ok(new Data_response<Data_output_register_class>
                {
                    status = true,
                    data = new Data_output_register_class
                    {
                        message = "Clase registrada y asistencia anotada correctamente"
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Data_response<Data_output_register_class>
                {
                    status = false,
                    data = new Data_output_register_class
                    {
                        message = "Error al registrar la clase: " + ex.Message
                    }
                });
            }
        }
    }
}
