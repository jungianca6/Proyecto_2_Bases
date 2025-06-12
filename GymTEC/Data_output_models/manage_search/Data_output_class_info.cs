namespace GymTEC.Data_output_models.manage_search
{
    public class Data_output_class_info
    {
        public string class_date { get; set; }          // Fecha cuando se realizará la clase (yyyy-MM-dd)
        public string start_date { get; set; }          // Fecha de inicio del período de la clase (yyyy-MM-dd)
        public string end_date { get; set; }            // Fecha de fin del período de la clase (yyyy-MM-dd)
        public string instructor { get; set; }          // Nombre del instructor
        public int available_spots { get; set; }        // Cupos disponibles
    }

}
