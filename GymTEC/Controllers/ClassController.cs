using GymTEC.Data_input_models.manage_class;
using GymTEC.Data_output_models.manage_class;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClassController : ControllerBase
    {

        
        private readonly DatabaseService _databaseService;

        public ClassController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost("add_class")]
        public ActionResult<Data_response<Data_output_add_class>> AddClass([FromBody] Data_input_add_class input)
        {
            var parameters = new Dictionary<string, object>
            {
                { "in_type", input.class_type },
                { "in_is_group", input.is_group_class },
                { "in_max_capacity", input.capacity },
                { "in_date", input.date.Date },  // solo la fecha
                { "in_start", input.start_time.ToString(@"hh\:mm\:ss") }, // formato TIME
                { "in_end", input.end_time.ToString(@"hh\:mm\:ss") },
                { "in_employee_name", input.instructor }
            };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_add_class(@in_type, @in_is_group, @in_max_capacity, @in_date, @in_start, @in_end, @in_employee_name)", parameters);

                var dataOutput = new Data_output_add_class
                {
                    class_type = input.class_type,
                    instructor = input.instructor,
                    is_group_class = input.is_group_class,
                    capacity = input.capacity,
                    date = input.date,
                    start_time = input.start_time,
                    end_time = input.end_time
                };

                return Ok(new Data_response<Data_output_add_class>
                {
                    status = true,
                    data = dataOutput
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
