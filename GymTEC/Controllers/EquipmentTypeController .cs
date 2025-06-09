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
            // Lógica para eliminar tipo de equipo

            var response = new Data_response<string>
            {
                status = true,
                data = "Tipo de equipo eliminado exitosamente"
            };

            return Ok(response);
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