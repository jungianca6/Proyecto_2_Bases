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

        [HttpPost("insert_spa_treatment")]
        public ActionResult<Data_response<Data_output_manage_spa_treatment>> InsertSpaTreatment([FromBody] Data_input_manage_spa_treatment input)
        {
            // Simulamos la inserción y devolvemos la misma data
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

        [HttpPost("edit_spa_treatment")]
        public ActionResult<Data_response<Data_output_manage_spa_treatment>> EditSpaTreatment([FromBody] Data_input_manage_spa_treatment input)
        {
            // Simulamos la edición y devolvemos la misma data
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

        [HttpPost("delete_spa_treatment")]
        public ActionResult<Data_response<string>> DeleteSpaTreatment([FromBody] Data_input_delete_spa_treatment input)
        {
            // Simulamos la eliminación
            var response = new Data_response<string>
            {
                status = true,
                data = "Treatment deleted successfully"
            };

            return Ok(response);
        }

        [HttpPost("consult_spa_treatment")]
        public ActionResult<Data_response<Data_output_manage_spa_treatment>> ConsultSpaTreatment([FromBody] Data_input_consult_spa_treatment input)
        {
            // Simulamos la consulta (devolver data de ejemplo)
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
    }
}