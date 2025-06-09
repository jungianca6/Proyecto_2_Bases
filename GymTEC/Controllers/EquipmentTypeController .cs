using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_equipment;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_equipment;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EquipmentTypeController : ControllerBase
    {
        [HttpPost("insert_or_edit")]
        public ActionResult<Data_response<Data_output_equipment_type>> InsertOrEditEquipmentType([FromBody] Data_input_equipment_type input)
        {
            // Lógica para insertar o editar tipo de equipo

            var data_output = new Data_output_equipment_type
            {
                equipment_type_id = input.equipment_type_id,
                description = input.description
            };

            var response = new Data_response<Data_output_equipment_type>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }

        [HttpPost("delete")]
        public ActionResult<Data_response<string>> DeleteEquipmentType([FromBody] Data_input_equipment_type input)
        {
            // Lógica para eliminar tipo de equipo

            var response = new Data_response<string>
            {
                status = true,
                data = "Tipo de equipo eliminado exitosamente"
            };

            return Ok(response);
        }

        [HttpPost("get")]
        public ActionResult<Data_response<Data_output_equipment_type>> GetEquipmentType([FromBody] Data_input_equipment_type input)
        {
            // Lógica para consultar tipo de equipo

            var data_output = new Data_output_equipment_type
            {
                equipment_type_id = input.equipment_type_id,
                description = "Descripción ejemplo del tipo de equipo"
            };

            var response = new Data_response<Data_output_equipment_type>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }
    }
}