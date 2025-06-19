namespace GymTEC.Data_input_models.manage_class
{
    public class Data_input_add_class
    {
        public string class_type { get; set; }         // Indoor Cycling, Pilates, Yoga, Zumba, Natación
        public string instructor { get; set; }
        public bool is_group_class { get; set; }
        public int capacity { get; set; }
        public DateTime date { get; set; }
        public TimeSpan start_time { get; set; }
        public TimeSpan end_time { get; set; }
    }

}
