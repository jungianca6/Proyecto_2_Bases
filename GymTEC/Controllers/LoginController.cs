using GymTEC.Data_input_models;
using GymTEC.Data_output_models;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        /// <summary>
        /// Realiza la autenticación de un usuario (log in).
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_log_in que contiene:
        /// - username: Nombre de usuario.
        /// - password: Contraseña del usuario.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con el resultado de la autenticación.
        /// - status = true si la autenticación es exitosa.
        /// - data = objeto Data_output_log_in (por ejemplo podría incluir token de sesión, rol, etc.).
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El username debe existir en el sistema.
        /// - La password debe coincidir con la registrada para el username.
        /// - Aquí se asume un mock (sin lógica real de autenticación implementada).
        /// </remarks>
        [HttpPost("log_in")]
        public ActionResult<Data_response<Data_output_log_in>> LogIn([FromBody] Data_input_log_in input)
        {
            // Simulamos respuesta (sin validar credenciales reales)
            Data_output_log_in data_Output = new Data_output_log_in();

            var response = new Data_response<Data_output_log_in>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }
    }
}