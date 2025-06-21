namespace GymTEC.Data_input_models.manage_payroll
{
    public class Data_input_manage_payroll_type
    {
        public string description { get; set; }
        public string puesto { get; set; }
        public decimal monthly_payment { get; set; }
        public decimal hourly_payment { get; set; }
        public decimal group_class_payment { get; set; }
    }
}