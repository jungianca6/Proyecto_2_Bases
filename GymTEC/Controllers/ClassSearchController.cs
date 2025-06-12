using GymTEC.Data_input_models.manage_search;
using GymTEC.Data_output_models.manage_search;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClassSearchController : ControllerBase
    {
        [HttpPost("search_class")]
        public ActionResult<Data_response<Data_output_class_info>> SearchClass([FromBody] Data_input_search_class input)
        {
            // Simulamos búsqueda de clases en las fechas indicadas
            var classList = new List<Data_output_class_info>
            {
                new Data_output_class_info
                {
                    class_date = "2025-06-05",
                    start_date = input.start_date,
                    end_date = input.end_date,
                    instructor = "María López",
                    available_spots = 10
                },
                new Data_output_class_info
                {
                    class_date = "2025-06-12",
                    start_date = input.start_date,
                    end_date = input.end_date,
                    instructor = "Carlos Pérez",
                    available_spots = 5
                }
            };

            var response = new Data_response<List<Data_output_class_info>>
            {
                status = true,
                data = classList
            };

            return Ok(response);
        }
    }
}
