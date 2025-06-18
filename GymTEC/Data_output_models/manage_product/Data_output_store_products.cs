namespace GymTEC.Data_output_models.manage_product
{
    public class Data_output_store_products
    {
        public List<Data_output_associate_store_product> associated_products { get; set; }
        public List<Data_output_associate_store_product> non_associated_products { get; set; }
    }
}
