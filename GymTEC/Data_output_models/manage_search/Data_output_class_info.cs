namespace GymTEC.Data_output_models.manage_search
{
    public class Data_output_class_info
    {
        public string class_date { get; set; }          // Fecha de la clase
        public string start_time { get; set; }          // Hora de inicio
        public string end_time { get; set; }            // Hora de finalización
        public string instructor { get; set; }          // Nombre del instructor
        public int available_spots { get; set; }        // Cupos disponibles
        public string start_date { get; set; }          // Fecha de inicio de búsqueda
        public string end_date { get; set; }            // Fecha de fin de búsqueda
    }

}
