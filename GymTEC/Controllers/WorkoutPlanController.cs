using GymTEC.Data_input_models.manage_workout;
using GymTEC.Data_output_models.manage_workout;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkoutPlanController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public WorkoutPlanController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost("view_workout_plan")]
        public ActionResult<Data_response<Data_output_view_workout_plan>> ViewWorkoutPlan([FromBody] Data_input_view_workout_plan input)
        {
            var parameters = new Dictionary<string, object>
                {
                    { "in_client_id", int.Parse(input.client_id) }
                };

            try
            {
                var result = _databaseService.ExecuteFunction("SELECT * FROM sp_view_workout_plan(@in_client_id)", parameters);

                var workoutPlan = new List<WorkoutPlanItem>();

                foreach (DataRow row in result.Rows)
                {
                    workoutPlan.Add(new WorkoutPlanItem
                    {
                        day = row["day"].ToString(),
                        exercise_name = row["exercise_name"].ToString(),
                        sets = Convert.ToInt32(row["sets"]),
                        repetitions = Convert.ToInt32(row["repetitions"]),
                        notes = row["notes"].ToString()
                    });
                }

                var dataOutput = new Data_output_view_workout_plan
                {
                    client_id = input.client_id,
                    workout_plan = workoutPlan
                };

                return Ok(new Data_response<Data_output_view_workout_plan>
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

        [HttpPost("create_workout_plan")]
        public ActionResult<Data_response<string>> CreateWorkoutPlan([FromBody] Data_input_create_workout_plan input)
        {
            var parameters = new Dictionary<string, object>
                {
                    { "in_client_id", input.client_id },
                    { "in_period", input.period },
                    { "in_day", input.day },
                    { "in_exercise_name", input.exercise_name },
                    { "in_sets", input.sets },
                    { "in_repetitions", input.repetitions },
                    { "in_notes", input.notes ?? string.Empty }
                };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_create_workout_plan(@in_client_id, @in_period, @in_day, @in_exercise_name, @in_sets, @in_repetitions, @in_notes)", parameters);

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = "Ejercicio agregado al plan de entrenamiento del cliente."
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
