using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_inventory;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_inventory;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InventoryController : ControllerBase
    {

        private readonly DatabaseService _databaseService;

        public InventoryController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        /// <summary>
        /// Inserta un nuevo equipo en el inventario o edita un equipo existente.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_inventory que contiene:
        /// - equipment_type: Tipo de equipo.
        /// - brand: Marca del equipo.
        /// - serial_number: Número de serie único del equipo (identificador principal).
        /// - cost: Costo del equipo.
        /// - branch_name: Nombre de la sucursal donde se encuentra el equipo.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con la información del equipo insertado o actualizado.
        /// - status = true si la operación es exitosa.
        /// - data = objeto Data_output_inventory con la información del equipo.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El serial_number debe ser único al insertar.
        /// - Para editar, el serial_number debe existir previamente.
        /// </remarks>
        [HttpPost("insert_or_edit")]
        public ActionResult<Data_response<Data_output_inventory>> InsertOrEditInventory([FromBody] Data_input_inventory input)
        {
            // Lógica para insertar o editar equipo en inventario

            var data_output = new Data_output_inventory
            {
                equipment_type = input.equipment_type,
                brand = input.brand,
                serial_number = input.serial_number,
                cost = input.cost,
                branch_name = input.branch_name
            };

            var response = new Data_response<Data_output_inventory>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }

        /// <summary>
        /// Elimina un equipo del inventario en base a su número de serie.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_inventory que contiene:
        /// - serial_number: Número de serie del equipo a eliminar.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con un mensaje de confirmación.
        /// - status = true si la operación es exitosa.
        /// - data = mensaje indicando que el equipo fue eliminado.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El serial_number debe existir previamente en el inventario.
        /// </remarks>
        [HttpPost("delete")]
        public ActionResult<Data_response<string>> DeleteInventory([FromBody] Data_input_inventory input)
        {
            // Lógica para eliminar equipo del inventario por serial_number

            var response = new Data_response<string>
            {
                status = true,
                data = "Equipo eliminado exitosamente del inventario"
            };

            return Ok(response);
        }

        /// <summary>
        /// Consulta la información de un equipo específico en el inventario.
        /// </summary>
        /// <param name="input">Objeto de tipo Data_input_inventory que contiene:
        /// - serial_number: Número de serie del equipo a consultar.
        /// </param>
        /// <returns>
        /// Devuelve un objeto Data_response con la información del equipo.
        /// - status = true si la operación es exitosa.
        /// - data = objeto Data_output_inventory con la información del equipo.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El serial_number debe existir previamente en el inventario.
        /// - Si no existe, se debería devolver status = false (no implementado aquí porque es un mock).
        /// </remarks>
        [HttpPost("get")]
        public ActionResult<Data_response<Data_output_inventory>> GetInventory([FromBody] Data_input_inventory input)
        {
            // Lógica para consultar equipo por serial_number

            var data_output = new Data_output_inventory
            {
                equipment_type = "Equipo de pesas",
                brand = "BrandX",
                serial_number = input.serial_number,
                cost = 2500.00,
                branch_name = "Sucursal Central"
            };

            var response = new Data_response<Data_output_inventory>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }

        [HttpPost("associate_machine")]
        public ActionResult<Data_response<Data_output_associate_machine>> AssociateMachine([FromBody] Data_input_associate_machine input)
        {
            // Simulamos la asociación de la máquina con la sucursal
            var dataOutput = new Data_output_associate_machine
            {
                serial_number = input.serial_number,
                brand = "TechFit", // Ejemplo fijo
                model = "X2000",   // Ejemplo fijo
                branch_name = input.branch_name
            };

            var response = new Data_response<Data_output_associate_machine>
            {
                status = true,
                data = dataOutput
            };

            return Ok(response);
        }

        [HttpPost("consult_machines_by_branch")]
        public ActionResult<Data_response<Data_output_consult_machine_by_branch>> ConsultMachinesByBranch([FromBody] Data_input_consult_machine_by_branch input)
        {
            // Simulamos la consulta con datos de ejemplo
            var dataOutput = new Data_output_consult_machine_by_branch
            {
                associated_machines = new List<Data_output_associate_machine>
                {
                    new Data_output_associate_machine
                    {
                        serial_number = "SN987654",
                        brand = "TechFit",
                        model = "X2000",
                        branch_name = input.branch_name
                    }
                },
                not_associated_machines = new List<Data_output_associate_machine>
                {
                    new Data_output_associate_machine
                    {
                        serial_number = "SN123321",
                        brand = "GymPro",
                        model = "Alpha5",
                        branch_name = null
                    }
                }
            };

            var response = new Data_response<Data_output_consult_machine_by_branch>
            {
                status = true,
                data = dataOutput
            };

            return Ok(response);
        }
    }

}