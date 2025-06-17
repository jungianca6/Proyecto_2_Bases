using GymTEC.Data_input_models.manage_schedule;
using GymTEC.Data_output_models.manage_schedule;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

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
            // Simulamos la copia de actividades con datos ficticios
            var copiedActivities = new Data_output_copy_schedule
            {
                copied_activities = new List<ActivityInfo>
                {
                    new ActivityInfo
                    {
                        activity_name = "Yoga",
                        date = "2025-06-08", // siguiente semana
                        start_time = "09:00",
                        end_time = "10:00"
                    },
                    new ActivityInfo
                    {
                        activity_name = "Pilates",
                        date = "2025-06-09",
                        start_time = "10:00",
                        end_time = "11:00"
                    }
                }
            };

            var response = new Data_response<Data_output_copy_schedule>
            {
                status = true,
                data = copiedActivities
            };

            return Ok(response);
        }
    }
}
