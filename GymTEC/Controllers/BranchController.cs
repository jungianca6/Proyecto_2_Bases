using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BranchController : ControllerBase
    {
        // Inyección de dependencia del logger
        private readonly ILogger<BranchController> _logger;
        private readonly DatabaseService _databaseService;

        public BranchController(ILogger<BranchController> logger, DatabaseService databaseService)
        {
            _logger = logger;
            _databaseService = databaseService;
        }

        /// <summary>
        /// Inserta una nueva sucursal en el sistema.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_manage_branch que contiene la información de la sucursal a insertar:
        /// - name
        /// - province
        /// - canton
        /// - district
        /// - opening_date
        /// - attention_schedule
        /// - admin_employee
        /// - max_capacity
        /// - phone_numbers
        /// - spa
        /// - store
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con la información de la sucursal insertada.
        /// - status = true si la operación es exitosa.
        /// - data = objeto Data_output_manage_branch con la información de la sucursal.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El nombre de la sucursal no debe repetirse.
        /// </remarks>
        [HttpPost("insert_branch")]
        public ActionResult<Data_response<Data_output_manage_branch>> InsertBranch([FromBody] Data_input_manage_branch input)
        {
            _logger.LogInformation("Received insert_branch request for branch: {Name}", input.name);

            // Procesar datos
            var phone1 = input.phone_numbers.Count > 0 ? input.phone_numbers[0] : "";
            var phone2 = input.phone_numbers.Count > 1 ? input.phone_numbers[1] : "";

            var parameters = new Dictionary<string, object>
            {
                { "in_name", input.name },
                { "in_province", input.province },
                { "in_canton", input.canton },
                { "in_district", input.district },
                { "in_email", $"{input.name.Replace(" ", "").ToLower()}@gymtec.com" }, // email autogenerado
                { "in_phone1", phone1 },
                { "in_phone2", phone2 },
                { "in_opening_date", input.opening_date },
                { "in_opening_hours", input.attention_schedule },
                { "in_spa", input.spa },
                { "in_store", input.store }
            };

            var result = _databaseService.ExecuteFunction("SELECT sp_insert_branch(@in_name, @in_province, @in_canton, @in_district, @in_email, @in_phone1, @in_phone2, @in_opening_date, @in_opening_hours, @in_spa, @in_store)", parameters);

            if (result.Rows.Count == 0)
            {
                return BadRequest(new Data_response<Data_output_manage_branch>
                {
                    status = false
                });
            }

            // Construir la respuesta
            var data_Output = new Data_output_manage_branch
            {
                name = input.name,
                province = input.province,
                canton = input.canton,
                district = input.district,
                opening_date = input.opening_date,
                attention_schedule = input.attention_schedule,
                admin_employee = input.admin_employee,
                max_capacity = input.max_capacity,
                phone_numbers = input.phone_numbers,
                spa = input.spa,
                store = input.store
            };

            return Ok(new Data_response<Data_output_manage_branch>
            {
                status = true,
                data = data_Output
            });
        }

        /// <summary>
        /// Edita la información de una sucursal existente en el sistema.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_manage_branch con los nuevos datos de la sucursal a editar.</param>
        /// <returns>
        /// Devuelve un objeto Data_response con la información de la sucursal actualizada.
        /// - status = true si la operación es exitosa.
        /// - data = objeto Data_output_manage_branch con la información actualizada.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - La sucursal debe existir previamente en el sistema.
        /// </remarks>
        [HttpPost("edit_branch")]
        public ActionResult<Data_response<Data_output_manage_branch>> EditBranch([FromBody] Data_input_manage_branch input)
        {
            _logger.LogInformation("Received edit_branch request for branch: {Name}", input.name);

            var phone1 = input.phone_numbers.Count > 0 ? input.phone_numbers[0] : "";
            var phone2 = input.phone_numbers.Count > 1 ? input.phone_numbers[1] : "";
            var parsedDate = DateTime.ParseExact(input.opening_date.Split(' ')[0], "dd/MM/yyyy", null);

            var parameters = new Dictionary<string, object>
                {
                    { "in_name", input.name },
                    { "in_province", input.province },
                    { "in_canton", input.canton },
                    { "in_district", input.district },
                    { "in_phone1", phone1 },
                    { "in_phone2", phone2 },
                    { "in_opening_date", parsedDate },
                    { "in_opening_hours", input.attention_schedule }
                };
            
            try
            {
                _databaseService.ExecuteFunction("SELECT sp_edit_branch(@in_name, @in_province, @in_canton, @in_district, @in_phone1, @in_phone2, @in_opening_date, @in_opening_hours)", parameters);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al editar la sucursal");
                return BadRequest(new Data_response<Data_output_manage_branch>
                {
                    status = false
                });
            }

            var data_Output = new Data_output_manage_branch
            {
                name = input.name,
                province = input.province,
                canton = input.canton,
                district = input.district,
                opening_date = input.opening_date,
                attention_schedule = input.attention_schedule,
                admin_employee = input.admin_employee,
                max_capacity = input.max_capacity,
                phone_numbers = input.phone_numbers,
                spa = input.spa,
                store = input.store
            };

            return Ok(new Data_response<Data_output_manage_branch>
            {
                status = true,
                data = data_Output
            });
        }

        /// <summary>
        /// Elimina una sucursal del sistema.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_delete_branch que contiene:
        /// - name: nombre de la sucursal a eliminar.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con un mensaje de confirmación.
        /// - status = true si la operación es exitosa.
        /// - data = mensaje de texto.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - La sucursal debe existir previamente en el sistema.
        /// </remarks>
        [HttpPost("delete_branch")]
        public ActionResult<Data_response<string>> DeleteBranch([FromBody] Data_input_delete_branch input)
        {
            _logger.LogInformation("Received delete_branch request for branch: {Name}", input.name);

            var parameters = new Dictionary<string, object>
            {
                { "in_name", input.name }
            };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_delete_branch(@in_name)", parameters);

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = "Sucursal eliminada exitosamente."
                });
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Error eliminando sucursal");
                return BadRequest(new Data_response<string>
                {
                    status = false
                });
            }
        }

        /// <summary>
        /// Consulta la información de una sucursal específica.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_consult_branch que contiene:
        /// - name: nombre de la sucursal a consultar.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con la información de la sucursal.
        /// - status = true si la operación es exitosa.
        /// - data = objeto Data_output_manage_branch con la información de la sucursal.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - La sucursal debe existir previamente en el sistema.
        /// - Si no existe, se debería devolver status = false (no implementado aquí porque es un mock).
        /// </remarks>
        [HttpPost("consult_branch")]
        public ActionResult<Data_response<Data_output_manage_branch>> ConsultBranch([FromBody] Data_input_consult_branch input)
        {
            _logger.LogInformation("Received consult_branch request for branch: {Name}", input.name);

            var parameters = new Dictionary<string, object>
    {
        { "in_name", input.name }
    };

            var result = _databaseService.ExecuteFunction("SELECT * FROM sp_consult_branch(@in_name)", parameters);

            if (result.Rows.Count == 0)
            {
                return NotFound(new Data_response<Data_output_manage_branch>
                {
                    status = false
                });
            }

            var row = result.Rows[0];


            var data_Output = new Data_output_manage_branch
            {
                name = row["name"].ToString(),
                province = row["province"].ToString(),
                canton = row["canton"].ToString(),
                district = row["district"].ToString(),
                opening_date = ((DateTime)row["opening_date"]).ToString("dd/MM/yyyy HH:mm"),
                attention_schedule = row["opening_hours"].ToString(),
                phone_numbers = new List<string> { row["phone1"].ToString(), row["phone2"].ToString() },
                spa = (bool)row["spa_exists"],
                store = (bool)row["store_exists"],
                admin_employee = "",
                max_capacity = 0     
            };

            return Ok(new Data_response<Data_output_manage_branch>
            {
                status = true,
                data = data_Output
            });
        }


    }
}