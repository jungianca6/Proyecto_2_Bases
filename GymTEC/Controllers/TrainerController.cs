using GymTEC.Data_input_models.manage_class;
using GymTEC.Data_input_models.manage_instructors;
using GymTEC.Data_output_models.manage_class;
using GymTEC.Data_output_models.manage_client;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrainerController : ControllerBase
    {

        
        private readonly DatabaseService _databaseService;

        public TrainerController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost("assign_trainer")]
        public ActionResult<Data_response<string>> AssignTrainer([FromBody] Data_input_assign_trainer_to_client input)
        {
            string msg = $"Instructor con cédula {input.trainer_id} asignado al cliente {input.client_id}.";

            return Ok(new Data_response<string>
            {
                status = true,
                data = msg
            });
        }

        [HttpGet("clients_without_trainer")]
        public ActionResult<Data_response<Data_output_get_clients_without_trainer>> GetClientsWithoutTrainer()
        {
            var clients = new Data_output_get_clients_without_trainer
            {
                clients = new List<ClientModel>
                {
                    new ClientModel { full_name = "Carlos Jiménez Solís", id_number = "115230456" },
                    new ClientModel { full_name = "María Rodríguez Vargas", id_number = "208740122" },
                    new ClientModel { full_name = "Luis Felipe Sánchez", id_number = "114560983" }
                }
            };

            return Ok(new Data_response<Data_output_get_clients_without_trainer>
            {
                status = true,
                data = clients
            });
        }

        [HttpPost("register_class")]
        public ActionResult<Data_response<string>> RegisterClass([FromBody] Data_input_register_trainer_class input)
        {
            string msg = $"Clase de {input.class_type} registrada para el {input.date} a las {input.start_time}.";

            return Ok(new Data_response<string>
            {
                status = true,
                data = msg
            });
        }

    }
}
