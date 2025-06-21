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


        /// <summary>
        /// Asigna un instructor a un cliente mediante sus identificadores.
        /// </summary>
        /// <param name="input">Objeto que contiene el ID del cliente y del instructor a asignar.</param>
        /// <returns>
        /// Respuesta con estado de la operación y un mensaje de confirmación.
        /// </returns>
        [HttpPost("assign_trainer")]
        public ActionResult<Data_response<string>> AssignTrainer([FromBody] Data_input_assign_trainer_to_client input)
        {
            // Diccionario con parámetros esperados por el stored procedure
            var parameters = new Dictionary<string, object>
            {
                { "in_client_id", input.client_id },     // ID del cliente
                { "in_trainer_id", input.trainer_id }    // ID del entrenador (instructor)
            };

            try
            {
                // Ejecuta la función almacenada que asigna el instructor al cliente
                _databaseService.ExecuteFunction("SELECT sp_assign_trainer_to_client(@in_client_id, @in_trainer_id)", parameters);

                // Construye el mensaje de éxito
                var msg = $"Instructor con cédula {input.trainer_id} asignado al cliente {input.client_id}.";

                // Retorna respuesta exitosa con mensaje
                return Ok(new Data_response<string>
                {
                    status = true,
                    data = msg
                });
            }
            catch (Exception ex)
            {
                // En caso de excepción, retorna detalles del error y causa interna si existe
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("clients_without_trainer")]
        public ActionResult<Data_response<IEnumerable<ClientModel>>> GetClientsWithoutTrainer()
        {
            try
            {
                var clients = _databaseService.QueryList<ClientModel>(
                    "SELECT * FROM sp_get_clients_without_trainer()",
                    new Dictionary<string, object>());

                return Ok(new Data_response<IEnumerable<ClientModel>>
                {
                    status = true,
                    data = clients
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
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
