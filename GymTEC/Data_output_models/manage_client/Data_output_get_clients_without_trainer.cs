namespace GymTEC.Data_output_models.manage_client
{

    public class ClientModel
    {
        // Nombre completo del cliente
        public string full_name { get; set; }

        // Cédula del cliente
        public string id_number { get; set; }
    }
    public class Data_output_get_clients_without_trainer
    {
        // Lista de clientes sin entrenador asignado
        public List<ClientModel> clients { get; set; }
    }
}
