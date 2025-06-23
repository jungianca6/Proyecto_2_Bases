namespace GymTEC.Data_output_models.manage_payroll
{
    public class Data_output_generate_payroll
    {
        public List<EmployeePayrollInfo> employees { get; set; }
    }

    public class EmployeePayrollInfo
    {
        public string employee_id { get; set; }           // número de cédula
        public string full_name { get; set; }           // nombre completo
        public int classes_or_hours { get; set; }       // número de clases impartidas o horas laboradas
        public decimal amount_to_pay { get; set; }      // monto a pagar

        public string type { get; set; }
    }
}
