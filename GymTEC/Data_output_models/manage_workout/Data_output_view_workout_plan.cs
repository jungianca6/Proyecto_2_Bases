namespace GymTEC.Data_output_models.manage_workout
{

    public class Data_output_view_workout_plan
    {
        public string client_id { get; set; }
        public List<WorkoutPlanItem> workout_plan { get; set; }
    }
    public class WorkoutPlanItem
    {
        public string day { get; set; }            // Día o fecha
        public string exercise_name { get; set; } // Nombre del ejercicio
        public int sets { get; set; }              // Series
        public int repetitions { get; set; }       // Repeticiones
        public string notes { get; set; }          // Notas adicionales (opcional)
    }
}
