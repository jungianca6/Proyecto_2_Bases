namespace GymTEC.Data_input_models.manage_workout
{
    public class Data_input_create_workout_plan
    {
        public string client_id { get; set; }
        public string period { get; set; }
        public string day { get; set; }
        public string exercise_name { get; set; }
        public int sets { get; set; }
        public int repetitions { get; set; }
        public string? notes { get; set; }
    }
}