using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_position;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_position;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PositionController : ControllerBase
    {
        [HttpPost("insert_position")]
        public ActionResult<Data_response<Data_output_manage_position>> InsertPosition([FromBody] Data_input_manage_position input)
        {
            var data_Output = new Data_output_manage_position
            {
                position_name = input.position_name,
                description = input.description,
                position_id = input.position_id
            };

            var response = new Data_response<Data_output_manage_position>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }

        [HttpPost("edit_position")]
        public ActionResult<Data_response<Data_output_manage_position>> EditPosition([FromBody] Data_input_manage_position input)
        {
            var data_Output = new Data_output_manage_position
            {
                position_name = input.position_name,
                description = input.description,
                position_id = input.position_id
            };

            var response = new Data_response<Data_output_manage_position>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }

        [HttpPost("delete_position")]
        public ActionResult<Data_response<string>> DeletePosition([FromBody] Data_input_delete_position input)
        {
            var response = new Data_response<string>
            {
                status = true,
                data = "Position deleted successfully"
            };

            return Ok(response);
        }

        [HttpPost("consult_position")]
        public ActionResult<Data_response<Data_output_manage_position>> ConsultPosition([FromBody] Data_input_consult_position input)
        {
            // Ejemplo de respuesta estática
            var data_Output = new Data_output_manage_position
            {
                position_name = "Entrenador Personal",
                description = "Responsable de guiar a los clientes en sus rutinas",
                position_id = input.position_id
            };

            var response = new Data_response<Data_output_manage_position>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }
    }
}