using GymTEC.Data_input_models.manage_workout;
using GymTEC.Data_output_models.manage_workout;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

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
            // Simulamos la respuesta con un plan de trabajo de ejemplo
            var workoutPlan = new List<WorkoutPlanItem>
            {
                new WorkoutPlanItem
                {
                    day = "Lunes",
                    exercise_name = "Flexiones",
                    sets = 3,
                    repetitions = 12,
                    notes = "Mantener la espalda recta"
                },
                new WorkoutPlanItem
                {
                    day = "Miércoles",
                    exercise_name = "Sentadillas",
                    sets = 4,
                    repetitions = 15,
                    notes = "Sin peso adicional"
                }
            };

            Data_output_view_workout_plan data_Output = new Data_output_view_workout_plan
            {
                client_id = input.client_id,
                workout_plan = workoutPlan
            };

            var response = new Data_response<Data_output_view_workout_plan>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }
    }
}
