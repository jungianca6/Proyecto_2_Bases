namespace GymTEC.Data_input_models.manage_branch
{
    public class Data_input_manage_branch
    {
        public string name { get; set; }
        public string province { get; set; }
        public string canton { get; set; }
        public string district { get; set; }
        public string opening_date { get; set; } // Formato: DD/MM/YYYY HH:MM
        public string attention_schedule { get; set; }
        public string admin_employee { get; set; }
        public int max_capacity { get; set; }
        public List<string> phone_numbers { get; set; }
        public bool spa { get; set; } = false;
        public bool store { get; set; } = false;
    }
}
