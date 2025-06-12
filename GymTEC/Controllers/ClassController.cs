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
        [HttpPost("add_class")]
        public ActionResult<Data_response<Data_output_add_class>> AddClass([FromBody] Data_input_add_class input)
        {
            // Simulamos la creación de la clase y devolvemos los datos recibidos
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

            var response = new Data_response<Data_output_add_class>
            {
                status = true,
                data = dataOutput
            };

            return Ok(response);
        }
    }
}
