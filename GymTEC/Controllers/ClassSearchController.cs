using GymTEC.Data_input_models.manage_search;
using GymTEC.Data_output_models.manage_search;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClassSearchController : ControllerBase
    {

        private readonly DatabaseService _databaseService;

        public ClassSearchController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost("search_class")]
        public ActionResult<Data_response<List<Data_output_class_info>>> SearchClass([FromBody] Data_input_search_class input)
        {
            var parameters = new Dictionary<string, object>
            {
                { "in_type", input.class_type },
                { "in_start_time", input.start_time },
                { "in_end_time", input.end_time }
            };

            try
            {
                DataTable result = _databaseService.ExecuteFunction(
                    "SELECT * FROM sp_search_class(@in_type, @in_start_time, @in_end_time)", parameters);

                var classList = new List<Data_output_class_info>();

                foreach (DataRow row in result.Rows)
                {
                    classList.Add(new Data_output_class_info
                    {
                        class_date = row["class_date"].ToString(),
                        start_time = row["start_time"].ToString(),
                        end_time = row["end_time"].ToString(),
                        instructor = row["instructor"].ToString(),
                        available_spots = Convert.ToInt32(row["available_spots"])
                    });
                }

                return Ok(new Data_response<List<Data_output_class_info>>
                {
                    status = true,
                    data = classList
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
