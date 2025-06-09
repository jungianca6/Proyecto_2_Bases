using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_inventory;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_inventory;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InventoryController : ControllerBase
    {
        [HttpPost("insert_or_edit")]
        public ActionResult<Data_response<Data_output_inventory>> InsertOrEditInventory([FromBody] Data_input_inventory input)
        {
            // Lógica para insertar o editar equipo en inventario

            var data_output = new Data_output_inventory
            {
                equipment_type = input.equipment_type,
                brand = input.brand,
                serial_number = input.serial_number,
                cost = input.cost,
                branch_name = input.branch_name
            };

            var response = new Data_response<Data_output_inventory>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }

        [HttpPost("delete")]
        public ActionResult<Data_response<string>> DeleteInventory([FromBody] Data_input_inventory input)
        {
            // Lógica para eliminar equipo del inventario por serial_number

            var response = new Data_response<string>
            {
                status = true,
                data = "Equipo eliminado exitosamente del inventario"
            };

            return Ok(response);
        }

        [HttpPost("get")]
        public ActionResult<Data_response<Data_output_inventory>> GetInventory([FromBody] Data_input_inventory input)
        {
            // Lógica para consultar equipo por serial_number

            var data_output = new Data_output_inventory
            {
                equipment_type = "Equipo de pesas",
                brand = "BrandX",
                serial_number = input.serial_number,
                cost = 2500.00,
                branch_name = "Sucursal Central"
            };

            var response = new Data_response<Data_output_inventory>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }
    }
}