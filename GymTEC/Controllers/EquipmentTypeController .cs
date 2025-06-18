using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_equipment;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_equipment;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EquipmentTypeController : ControllerBase
    {

        private readonly DatabaseService _databaseService;

        public EquipmentTypeController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }
        /// <summary>
        /// Inserta un nuevo tipo de equipo o edita un tipo de equipo existente en el sistema.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_equipment_type que contiene:
        /// - equipment_type_id (identificador único del tipo de equipo)
        /// - description (descripción del tipo de equipo)
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con la información del tipo de equipo insertado o actualizado.
        /// - status = true si la operación es exitosa.
        /// - data = objeto Data_output_equipment_type con la información del tipo de equipo.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El equipment_type_id debe ser único al insertar.
        /// - Para editar, el equipment_type_id debe existir previamente.
        /// </remarks>
        [HttpPost("insert_or_edit")]
        public ActionResult<Data_response<Data_output_equipment_type>> InsertOrEditEquipmentType([FromBody] Data_input_equipment_type input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_name", input.name },
        { "in_description", input.description }
    };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_insert_or_edit_equipment_type(@in_name, @in_description)", parameters);

                var data_output = new Data_output_equipment_type
                {
                    name = input.name,
                    description = input.description
                };

                return Ok(new Data_response<Data_output_equipment_type>
                {
                    status = true,
                    data = data_output
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Data_response<Data_output_equipment_type>
                {
                    status = false,
                    data = null
                });
            }
        }

        /// <summary>
        /// Elimina un tipo de equipo del sistema.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_equipment_type que contiene:
        /// - equipment_type_id del tipo de equipo a eliminar.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con un mensaje de confirmación.
        /// - status = true si la operación es exitosa.
        /// - data = mensaje de texto indicando que se eliminó el tipo de equipo.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El equipment_type_id debe existir previamente en el sistema.
        /// </remarks>
        [HttpPost("delete")]
        public ActionResult<Data_response<string>> DeleteEquipmentType([FromBody] Data_input_equipment_type input)
        {
            var parameters = new Dictionary<string, object>
            {
                { "in_name", input.name }
            };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_delete_equipment_type(@in_name)", parameters);

                var response = new Data_response<string>
                {
                    status = true,
                    data = "Tipo de equipo eliminado exitosamente"
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

        /// <summary>
        /// Consulta la información de un tipo de equipo específico.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_equipment_type que contiene:
        /// - equipment_type_id del tipo de equipo a consultar.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con la información del tipo de equipo.
        /// - status = true si la operación es exitosa.
        /// - data = objeto Data_output_equipment_type con la información del tipo de equipo.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El equipment_type_id debe existir previamente en el sistema.
        /// - Si no existe, se debería devolver status = false (no implementado aquí porque es un mock).
        /// </remarks>
        [HttpPost("get")]
        public ActionResult<Data_response<Data_output_equipment_type>> GetEquipmentType([FromBody] Data_input_equipment_type input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_name", input.name }
    };

            try
            {
                DataTable result = _databaseService.ExecuteFunction(
                    "SELECT * FROM sp_get_equipment_type(@in_name)", parameters);

                if (result.Rows.Count == 0)
                {
                    return NotFound(new
                    {
                        status = false,
                        error = "Tipo de equipo no encontrado",
                        inner = (string)null
                    });
                }

                var row = result.Rows[0];

                var data_output = new Data_output_equipment_type
                {
                    name = row["name"].ToString(),
                    description = row["description"].ToString()
                };

                return Ok(new Data_response<Data_output_equipment_type>
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