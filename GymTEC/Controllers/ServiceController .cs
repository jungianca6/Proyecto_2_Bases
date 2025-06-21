using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_services;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_services;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public ServiceController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        /// <summary>
        /// Inserta un nuevo servicio o edita uno existente según el service_id proporcionado.
        /// </summary>
        /// <param name="input">Objeto Data_input_service que contiene el identificador y la descripción del servicio.</param>
        /// <returns>
        /// Respuesta con estado y datos del servicio insertado o editado.
        /// - status: true si la operación fue exitosa.
        /// - data: Data_output_service con los datos del servicio actualizado.
        /// </returns>
        /// <remarks>
        /// Si el service_id es nuevo, se crea un nuevo registro. Si ya existe, se actualizan los datos.
        /// Se debe validar que la descripción no esté vacía y que el service_id sea válido.
        /// </remarks>
        [HttpPost("insert_or_edit")]
        public ActionResult<Data_response<Data_output_service>> InsertOrEditService([FromBody] Data_input_service input)
        {
            var parameters = new Dictionary<string, object>
                {
                    { "in_service_name", input.service_name },
                    { "in_description", input.description },
                    { "in_class_name", input.class_name }
                };

            try
            {
                _databaseService.ExecuteFunction(
                    "SELECT sp_insert_or_edit_service(@in_service_name, @in_description, @in_class_name)",
                    parameters);

                var data_output = new Data_output_service
                {
                    service_name = input.service_name,
                    description = input.description
                };

                return Ok(new Data_response<Data_output_service>
                {
                    status = true,
                    data = data_output
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

        /// <summary>
        /// Elimina un servicio del sistema basado en el service_id proporcionado.
        /// </summary>
        /// <param name="input">Objeto Data_input_service que contiene el identificador del servicio a eliminar.</param>
        /// <returns>
        /// Respuesta con estado y mensaje de confirmación.
        /// - status: true si la eliminación fue exitosa.
        /// - data: mensaje indicando el resultado de la operación.
        /// </returns>
        /// <remarks>
        /// Es importante asegurarse de que el service_id exista antes de intentar eliminar.
        /// El sistema podría validar que no existan dependencias asociadas al servicio antes de la eliminación.
        /// </remarks>
        [HttpPost("delete")]
        public ActionResult<Data_response<string>> DeleteService([FromBody] Data_input_service input)
        {
            var parameters = new Dictionary<string, object>
                {
                    { "in_name", input.service_name }
                };

            try
            {
                _databaseService.ExecuteFunction(
                    "SELECT sp_delete_service_by_name(@in_name)",
                    parameters
                );

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = "Servicio eliminado exitosamente."
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

        /// <summary>
        /// Consulta la información de un servicio dado su service_id.
        /// </summary>
        /// <param name="input">Objeto Data_input_service que contiene el identificador del servicio a consultar.</param>
        /// <returns>
        /// Respuesta con estado y datos del servicio consultado.
        /// - status: true si la consulta fue exitosa.
        /// - data: Data_output_service con la información del servicio.
        /// </returns>
        /// <remarks>
        /// Se espera que el service_id corresponda a un servicio existente.
        /// En caso de no encontrar el servicio, se debería manejar un error o devolver un status false.
        /// </remarks>
        [HttpPost("get")]
        public ActionResult<Data_response<Data_output_service>> GetService([FromBody] Data_input_service input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_name", input.service_name }
    };

            try
            {
                DataTable result = _databaseService.ExecuteFunction(
                    "SELECT * FROM sp_get_service_by_name(@in_name)",
                    parameters
                );

                if (result.Rows.Count == 0)
                {
                    return NotFound(new
                    {
                        status = false,
                        error = "No se encontró un servicio con esa descripción."
                    });
                }

                var row = result.Rows[0];
                var data_output = new Data_output_service
                {
                    service_name = row["service_name"].ToString(),
                    description = row["description"].ToString()
                };

                return Ok(new Data_response<Data_output_service>
                {
                    status = true,
                    data = data_output
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
    }
}