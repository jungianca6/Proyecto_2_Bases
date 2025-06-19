namespace GymTEC.Data_input_models.manage_product
{
    // Clase de entrada para insertar, editar y eliminar productos
    public class Data_input_product
    {
        public string product_name { get; set; }      // nombre
        public string barcode { get; set; }           // código de barras
        public string description { get; set; }       // descripción
        public double cost { get; set; }              // costo
    }
}
