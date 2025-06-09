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

        /// <summary>
        /// Edita un puesto de trabajo existente.
        /// </summary>
        /// <param name="input">Objeto Data_input_manage_position con:
        /// - position_name: Nombre actualizado del puesto.
        /// - description: Descripción actualizada del puesto.
        /// - position_id: Identificador único del puesto a editar.
        /// </param>
        /// <returns>
        /// Data_response con el objeto editado.
        /// - status: true si la operación fue exitosa.
        /// - data: Data_output_manage_position con los datos actualizados.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El position_id debe existir en la base de datos.
        /// </remarks>
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

        /// <summary>
        /// Elimina un puesto de trabajo existente.
        /// </summary>
        /// <param name="input">Objeto Data_input_delete_position con:
        /// - position_id: Identificador único del puesto a eliminar.
        /// </param>
        /// <returns>
        /// Data_response con mensaje de éxito.
        /// - status: true si la eliminación fue exitosa.
        /// - data: Mensaje de confirmación.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El position_id debe existir.
        /// - No debe haber empleados asignados a este puesto antes de eliminar.
        /// </remarks>
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

        /// <summary>
        /// Consulta la información de un puesto de trabajo.
        /// </summary>
        /// <param name="input">Objeto Data_input_consult_position con:
        /// - position_id: Identificador único del puesto a consultar.
        /// </param>
        /// <returns>
        /// Data_response con los datos del puesto consultado.
        /// - status: true si la consulta fue exitosa.
        /// - data: Data_output_manage_position con los datos del puesto.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El position_id debe existir.
        /// </remarks>
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