namespace GymTEC.Data_input_models.manage_class
{
    public class Data_input_register_class
    {
        public string class_date { get; set; }          // Fecha cuando se realizará la clase (yyyy-MM-dd)
        public string start_time { get; set; }          // Fecha de inicio del período de la clase (yyyy-MM-dd)
        public string end_time { get; set; }            // Fecha de fin del período de la clase (yyyy-MM-dd)
        public string instructor { get; set; }          // Nombre del instructor
        public int available_spots { get; set; }        // Cupos disponibles
    }
}
