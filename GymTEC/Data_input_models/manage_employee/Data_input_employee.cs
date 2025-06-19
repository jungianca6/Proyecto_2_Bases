namespace GymTEC.Data_input_models.manage_employee
{
    public class Data_input_employee
    {
        public string employee_id { get; set; } // número de cédula
        public string full_name { get; set; }
        public string province { get; set; }
        public string canton { get; set; }
        public string district { get; set; }
        public string position { get; set; }
        public string branch { get; set; }
        public int payroll_id { get; set; }       // AHORA ES EL ID
        public int salary { get; set; }
        public string email { get; set; }
        public string password { get; set; }
    }
}
