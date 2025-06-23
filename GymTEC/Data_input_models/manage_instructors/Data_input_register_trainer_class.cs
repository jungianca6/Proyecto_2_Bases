namespace GymTEC.Data_input_models.manage_instructors
{
    public class Data_input_register_trainer_class
    {
        // Tipo de clase (ej. Indoor Cycling, Pilates, etc.)
        public string class_type { get; set; }

        // Nombre del instructor
        public string instructor { get; set; }

        // Indica si la clase es grupal
        public bool is_group { get; set; }

        // Capacidad máxima de la clase
        public int capacity { get; set; }

        // Fecha de la clase (formato yyyy-MM-dd)
        public string date { get; set; }

        // Hora de inicio (formato HH:mm)
        public string start_time { get; set; }

        // Hora de finalización (formato HH:mm)
        public string end_time { get; set; }
    }
}
