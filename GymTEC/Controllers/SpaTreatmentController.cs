using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_spa;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_spa;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SpaTreatmentController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public SpaTreatmentController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        /// <summary>
        /// Inserta un nuevo tratamiento spa o registra uno nuevo.
        /// </summary>
        /// <param name="input">Datos de entrada con el nombre y el ID del tratamiento spa.</param>
        /// <returns>
        /// Respuesta con estado y datos del tratamiento insertado.
        /// - status: true si la inserción fue exitosa.
        /// - data: información del tratamiento spa insertado.
        /// </returns>
        [HttpPost("insert_spa_treatment")]
        public ActionResult<Data_response<Data_output_manage_spa_treatment>> InsertSpaTreatment([FromBody] Data_input_manage_spa_treatment input)
        {
            // Simulamos la inserción y devolvemos la misma data recibida como confirmación
            Data_output_manage_spa_treatment data_Output = new Data_output_manage_spa_treatment
            {
                treatment_name = input.treatment_name,
                treatment_id = input.treatment_id
            };

            var response = new Data_response<Data_output_manage_spa_treatment>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }

        /// <summary>
        /// Edita un tratamiento spa existente basado en el treatment_id.
        /// </summary>
        /// <param name="input">Datos con el nombre actualizado y el ID del tratamiento a modificar.</param>
        /// <returns>
        /// Respuesta con estado y datos del tratamiento editado.
        /// </returns>
        [HttpPost("edit_spa_treatment")]
        public ActionResult<Data_response<Data_output_manage_spa_treatment>> EditSpaTreatment([FromBody] Data_input_manage_spa_treatment input)
        {
            // Simulamos la edición y devolvemos la misma data recibida
            Data_output_manage_spa_treatment data_Output = new Data_output_manage_spa_treatment
            {
                treatment_name = input.treatment_name,
                treatment_id = input.treatment_id
            };

            var response = new Data_response<Data_output_manage_spa_treatment>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }

        /// <summary>
        /// Elimina un tratamiento spa dado su treatment_id.
        /// </summary>
        /// <param name="input">Datos que contienen el ID del tratamiento a eliminar.</param>
        /// <returns>
        /// Respuesta con estado y mensaje de confirmación de eliminación.
        /// </returns>
        [HttpPost("delete_spa_treatment")]
        public ActionResult<Data_response<string>> DeleteSpaTreatment([FromBody] Data_input_delete_spa_treatment input)
        {
            // Simulamos la eliminación del tratamiento spa
            var response = new Data_response<string>
            {
                status = true,
                data = "Treatment deleted successfully"
            };

            return Ok(response);
        }

        /// <summary>
        /// Consulta un tratamiento spa por su treatment_id.
        /// </summary>
        /// <param name="input">Datos que contienen el ID del tratamiento a consultar.</param>
        /// <returns>
        /// Respuesta con estado y datos del tratamiento consultado.
        /// </returns>
        [HttpPost("consult_spa_treatment")]
        public ActionResult<Data_response<Data_output_manage_spa_treatment>> ConsultSpaTreatment([FromBody] Data_input_consult_spa_treatment input)
        {
            // Simulamos la consulta devolviendo un tratamiento de ejemplo
            Data_output_manage_spa_treatment data_Output = new Data_output_manage_spa_treatment
            {
                treatment_name = "Masaje relajante",
                treatment_id = input.treatment_id
            };

            var response = new Data_response<Data_output_manage_spa_treatment>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }

        [HttpPost("associate_spa_treatment")]
        public ActionResult<Data_response<string>> AssociateSpaTreatment([FromBody] Data_input_associate_spa_treatment input)
        {
            // Simulamos la asociación del tratamiento spa a la sucursal
            var response = new Data_response<string>
            {
                status = true,
                data = $"Tratamiento con ID {input.treatment_id} asociado a la sucursal {input.branch_name} exitosamente"
            };

            return Ok(response);
        }

        [HttpPost("consult_spa_treatments")]
        public ActionResult<Data_response<List<Data_output_associate_spa_treatment>>> ConsultSpaTreatments([FromBody] Data_input_consult_spa_treatment input)
        {
            // Simulamos la consulta devolviendo una lista de tratamientos asociados y no asociados
            var treatments = new List<Data_output_associate_spa_treatment>
            {
                new Data_output_associate_spa_treatment { treatment_id = 1, treatment_name = "Masaje relajante" },
                new Data_output_associate_spa_treatment { treatment_id = 2, treatment_name = "Aromaterapia" }
            };

            var response = new Data_response<List<Data_output_associate_spa_treatment>>
            {
                status = true,
                data = treatments
            };

            return Ok(response);
        }

    }
}