using GymTEC.Data_input_models.manage_schedule;
using GymTEC.Data_output_models.manage_schedule;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public ScheduleController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost("copy_schedule")]
        public ActionResult<Data_response<Data_output_copy_schedule>> CopySchedule([FromBody] Data_input_copy_schedule input)
        {
            var parameters = new Dictionary<string, object>
                {
                    { "in_branch_name", input.branch_name },
                    { "in_start_week", input.start_week_date }, // string
                    { "in_end_week", input.end_week_date }      // string
                };

            try
            {
                DataTable result = _databaseService.ExecuteFunction(
                    "SELECT * FROM sp_copy_schedule(@in_branch_name, @in_start_week, @in_end_week)",
                    parameters
                );

                var copiedActivities = new List<ActivityInfo>();
                foreach (DataRow row in result.Rows)
                {
                    copiedActivities.Add(new ActivityInfo
                    {
                        activity_name = row["activity_name"].ToString(),
                        date = row["date"].ToString(),
                        start_time = row["start_time"].ToString(),
                        end_time = row["end_time"].ToString()
                    });
                }

                return Ok(new Data_response<Data_output_copy_schedule>
                {
                    status = true,
                    data = new Data_output_copy_schedule
                    {
                        copied_activities = copiedActivities
                    }
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
