namespace GymTEC.Data_output_models.manage_inventory
{
    // Clase de salida para consultar inventario
    public class Data_output_inventory
    {
        public string equipment_type { get; set; }
        public string brand { get; set; }
        public string serial_number { get; set; }
        public double cost { get; set; }
        public string branch_name { get; set; }
    }
}
