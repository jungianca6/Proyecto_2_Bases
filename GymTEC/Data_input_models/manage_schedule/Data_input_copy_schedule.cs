namespace GymTEC.Data_input_models.manage_schedule
{
    public class Data_input_copy_schedule
    {
        public string branch_name { get; set; }
        public string start_week_date { get; set; }  // formato "yyyy-MM-dd"
        public string end_week_date { get; set; }    // formato "yyyy-MM-dd"
    }
}
