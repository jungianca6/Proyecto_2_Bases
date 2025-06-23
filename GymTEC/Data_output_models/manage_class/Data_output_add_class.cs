namespace GymTEC.Data_output_models.manage_class
{
    public class Data_output_add_class
    {
        public string class_type { get; set; }
        public string instructor { get; set; }
        public bool is_group_class { get; set; }
        public int capacity { get; set; }
        public DateTime date { get; set; }
        public TimeSpan start_time { get; set; }
        public TimeSpan end_time { get; set; }
    }
}
