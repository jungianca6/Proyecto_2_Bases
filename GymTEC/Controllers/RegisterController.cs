using GymTEC.Data_input_models;
using GymTEC.Data_output_models;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public RegisterController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }


        /// <summary>
        /// Registra un nuevo cliente en el sistema.
        /// </summary>
        /// <param name="input">Objeto Data_input_register_client con los datos del cliente a registrar.</param>
        /// <returns>
        /// Data_response con los datos del cliente registrado.
        /// - status: true si el registro fue exitoso.
        /// - data: Data_output_register_client con la información del cliente registrado.
        /// </returns>
        /// <remarks>
        /// Se espera que el input contenga toda la información necesaria para el registro.
        /// </remarks>
        [HttpPost("register_client")]
        public ActionResult<Data_response<Data_output_register_client>> RegisterClient([FromBody] Data_input_register_client input)
        {
            // Aquí iría la lógica para registrar un cliente con base en la información recibida

            Data_output_register_client data_Output = new Data_output_register_client();

            var response = new Data_response<Data_output_register_client>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }
    }
}