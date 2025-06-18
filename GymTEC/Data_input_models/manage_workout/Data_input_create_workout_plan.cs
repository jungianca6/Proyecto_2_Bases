namespace GymTEC.Data_input_models.manage_workout
{
    public class Data_input_create_workout_plan
    {
        // Cédula del cliente
        public string client_id { get; set; }

        // Día de la semana para el ejercicio (ej. Lunes, Martes, etc.)
        public string day { get; set; }

        // Nombre del ejercicio
        public string exercise_name { get; set; }

        // Número de sets (series)
        public int sets { get; set; }

        // Número de repeticiones por set
        public int repetitions { get; set; }

        // Notas u observaciones
        public string notes { get; set; }
    }
}
