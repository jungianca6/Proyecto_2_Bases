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
        private readonly DatabaseService _databaseService;

        public PositionController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        /// <summary>
        /// Inserta un nuevo puesto de trabajo.
        /// </summary>
        /// <param name="input">Objeto Data_input_manage_position con:
        /// - position_name: Nombre del puesto.
        /// - description: Descripción del puesto.
        /// - position_id: Identificador único del puesto.
        /// </param>
        /// <returns>
        /// Data_response con el objeto insertado.
        /// - status: true si fue exitoso.
        /// - data: Data_output_manage_position con los datos insertados.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El position_id no debe existir previamente.
        /// - El nombre del puesto no debe estar vacío.
        /// </remarks>
        [HttpPost("insert_position")]
        public ActionResult<Data_response<Data_output_manage_position>> InsertPosition([FromBody] Data_input_manage_position input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_name", input.position_name },
        { "in_description", input.description }
    };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_insert_position(@in_name, @in_description)", parameters);

                var data_Output = new Data_output_manage_position
                {
                    position_name = input.position_name,
                    description = input.description,
                    position_id = null // o vacío, ya que no se recupera el ID insertado
                };

                var response = new Data_response<Data_output_manage_position>
                {
                    status = true,
                    data = data_Output
                };

                return Ok(response);
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

        [HttpPost("edit_position")]
        public ActionResult<Data_response<Data_output_manage_position>> EditPosition([FromBody] Data_input_manage_position input)
        {
            if (string.IsNullOrWhiteSpace(input.position_id))
            {
                return BadRequest(new { status = false, error = "El ID del puesto es obligatorio." });
            }

            var parameters = new Dictionary<string, object>
    {
        { "in_position_id", int.Parse(input.position_id) },
        { "in_name", input.position_name },
        { "in_description", input.description }
    };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_edit_position(@in_position_id, @in_name, @in_description)", parameters);

                var data_Output = new Data_output_manage_position
                {
                    position_id = input.position_id,
                    position_name = input.position_name,
                    description = input.description
                };

                return Ok(new Data_response<Data_output_manage_position>
                {
                    status = true,
                    data = data_Output
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

        [HttpPost("delete_position")]
        public ActionResult<Data_response<string>> DeletePosition([FromBody] Data_input_delete_position input)
        {
            // Validación básica
            if (string.IsNullOrWhiteSpace(input.position_name))
            {
                return BadRequest(new
                {
                    status = false,
                    error = "El nombre del puesto es obligatorio."
                });
            }

            var parameters = new Dictionary<string, object>
    {
        { "in_name", input.position_name }
    };

            try
            {
                _databaseService.ExecuteFunction(
                    "SELECT sp_delete_position(@in_name)",
                    parameters
                );

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = "Position deleted successfully"
                });
            }
            catch (Exception ex)
            {
                // Si no existe el puesto
                if (ex.Message.Contains("No existe un puesto con ese nombre"))
                {
                    return NotFound(new
                    {
                        status = false,
                        error = ex.Message
                    });
                }
                // Si hay empleados asignados
                if (ex.Message.StartsWith("No se puede eliminar"))
                {
                    return BadRequest(new
                    {
                        status = false,
                        error = ex.Message
                    });
                }

                // Otros errores
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        [HttpPost("consult_position")]
        public ActionResult<Data_response<Data_output_manage_position>> ConsultPosition([FromBody] Data_input_consult_position input)
        {
            // Validación básica
            if (string.IsNullOrWhiteSpace(input.position_name))
            {
                return BadRequest(new { status = false, error = "El nombre del puesto es obligatorio." });
            }

            var parameters = new Dictionary<string, object>
    {
        { "in_name", input.position_name }
    };

            try
            {
                // Ejecuta la función y mapea columnas a Data_output_manage_position
                var result = _databaseService.QuerySingle<Data_output_manage_position>(
                    @"SELECT 
                position_id::TEXT   AS position_id,
                position_name       AS position_name,
                description
              FROM sp_consult_position(@in_name)",
                    parameters
                );

                return Ok(new Data_response<Data_output_manage_position>
                {
                    status = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                // Si la excepción viene del SP por no existir, devolvemos 404
                if (ex.Message.Contains("No existe un puesto con ese nombre"))
                {
                    return NotFound(new
                    {
                        status = false,
                        error = ex.Message
                    });
                }

                // Otros errores
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

    }
}