namespace GymTEC.Data_input_models.manage_inventory
{
    // Clase de entrada para insertar, editar y eliminar inventario
    public class Data_input_inventory
    {
        public string equipment_type { get; set; }    // tipo de equipo
        public string brand { get; set; }              // marca
        public string serial_number { get; set; }      // número de serie
        public double cost { get; set; }               // costo
        public string branch_name { get; set; }        // nombre de sucursal
    }
}
