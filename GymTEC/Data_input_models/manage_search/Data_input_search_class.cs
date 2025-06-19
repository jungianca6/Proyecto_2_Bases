namespace GymTEC.Data_input_models.manage_search
{
    public class Data_input_search_class
    {
        public string class_type { get; set; }          // Tipo de clase (Indoor Cycling, Pilates, Yoga, Zumba, Natación)
        public string start_date { get; set; }          // Fecha de inicio de búsqueda (formato yyyy-MM-dd)
        public string end_date { get; set; }            // Fecha de fin de búsqueda (formato yyyy-MM-dd)
    }
}
