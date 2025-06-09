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

        public BranchController(ILogger<BranchController> logger)
        {
            _logger = logger;
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

            // Simulamos la inserción y devolvemos la misma data
            Data_output_manage_branch data_Output = new Data_output_manage_branch
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

            var response = new Data_response<Data_output_manage_branch>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
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

            // Simulamos la edición y devolvemos la misma data
            Data_output_manage_branch data_Output = new Data_output_manage_branch
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

            var response = new Data_response<Data_output_manage_branch>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
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

            // Simulamos la eliminación
            var response = new Data_response<string>
            {
                status = true,
                data = "Branch deleted successfully"
            };

            return Ok(response);
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

            // Simulamos la consulta (devolver data de ejemplo)
            Data_output_manage_branch data_Output = new Data_output_manage_branch
            {
                name = input.name,
                province = "San José",
                canton = "Central",
                district = "Carmen",
                opening_date = "08/06/2025 09:00",
                attention_schedule = "08:00-18:00",
                admin_employee = "Carlos López",
                max_capacity = 150,
                phone_numbers = new List<string> { "2222-3333", "8888-9999" },
                spa = false,
                store = false
            };

            var response = new Data_response<Data_output_manage_branch>
            {
                status = true,
                data = data_Output
            };

            return Ok(response);
        }
    }
}