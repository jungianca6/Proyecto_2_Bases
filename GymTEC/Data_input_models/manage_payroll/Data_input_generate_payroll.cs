namespace GymTEC.Data_input_models.manage_payroll
{
    public class Data_input_generate_payroll
    {
        public string branch_name { get; set; }
        public string description { get; set; }
        public string start_date { get; set; }  // en formato "yyyy-MM-dd"
        public string end_date { get; set; }
    }
}
