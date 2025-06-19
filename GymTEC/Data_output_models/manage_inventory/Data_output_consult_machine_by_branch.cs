namespace GymTEC.Data_output_models.manage_inventory
{
    public class Data_output_consult_machine_by_branch
    {
        public List<Data_output_associate_machine> associated_machines { get; set; }
        public List<Data_output_associate_machine> not_associated_machines { get; set; }
    }
}
