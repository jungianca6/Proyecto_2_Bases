using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_services;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_services;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ServiceController : ControllerBase
    {
        [HttpPost("insert_or_edit")]
        public ActionResult<Data_response<Data_output_service>> InsertOrEditService([FromBody] Data_input_service input)
        {
            // Lógica para insertar o editar servicio por service_id

            var data_output = new Data_output_service
            {
                service_id = input.service_id,
                description = input.description
            };

            var response = new Data_response<Data_output_service>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }

        [HttpPost("delete")]
        public ActionResult<Data_response<string>> DeleteService([FromBody] Data_input_service input)
        {
            // Lógica para eliminar servicio por service_id

            var response = new Data_response<string>
            {
                status = true,
                data = "Servicio eliminado exitosamente"
            };

            return Ok(response);
        }

        [HttpPost("get")]
        public ActionResult<Data_response<Data_output_service>> GetService([FromBody] Data_input_service input)
        {
            // Lógica para consultar servicio por service_id

            // Ejemplo ficticio
            var data_output = new Data_output_service
            {
                service_id = input.service_id,
                description = "Descripción del servicio ejemplo"
            };

            var response = new Data_response<Data_output_service>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }
    }
}