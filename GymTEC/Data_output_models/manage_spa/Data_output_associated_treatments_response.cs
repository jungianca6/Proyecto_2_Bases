namespace GymTEC.Data_output_models.manage_spa
{
    public class Data_output_associated_treatments_response
    {
        public List<Data_output_associate_spa_treatment> associated { get; set; }
        public List<Data_output_associate_spa_treatment> not_associated { get; set; }
    }
}
