namespace GymTEC.Data_output_models.manage_schedule
{
    public class ActivityInfo
    {
        public string activity_name { get; set; }
        public string date { get; set; }           // fecha de la actividad
        public string start_time { get; set; }    // hora de inicio
        public string end_time { get; set; }      // hora de finalización
    }

    public class Data_output_copy_schedule
    {
        public List<ActivityInfo> copied_activities { get; set; }
    }
}
