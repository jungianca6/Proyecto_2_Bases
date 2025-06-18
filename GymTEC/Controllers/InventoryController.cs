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
            var parameters = new Dictionary<string, object>
            {
                { "in_equipment_type_name", input.equipment_type },
                { "in_brand", input.brand },
                { "in_serial_number", input.serial_number },
                { "in_cost", input.cost },
                { "in_branch_name", input.branch_name }
            };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_insert_or_edit_inventory(@in_equipment_type_name, @in_brand, @in_serial_number, @in_cost, @in_branch_name)", parameters);

                var data_output = new Data_output_inventory
                {
                    equipment_type = input.equipment_type,
                    brand = input.brand,
                    serial_number = input.serial_number,
                    cost = input.cost,
                    branch_name = input.branch_name
                };

                return Ok(new Data_response<Data_output_inventory>
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
            var parameters = new Dictionary<string, object>
    {
        { "in_serial_number", input.serial_number }
    };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_delete_inventory_by_serial(@in_serial_number)", parameters);

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = "Equipo eliminado exitosamente del inventario"
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
            var parameters = new Dictionary<string, object>
                {
                    { "in_serial_number", input.serial_number }
                };

            try
            {
                var result = _databaseService.QuerySingle<Data_output_inventory>(
                    "SELECT * FROM sp_get_inventory_by_serial(@in_serial_number)",
                    parameters
                );

                return Ok(new Data_response<Data_output_inventory>
                {
                    status = true,
                    data = result
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


        [HttpPost("associate_machine")]
        public ActionResult<Data_response<Data_output_associate_machine>> AssociateMachine([FromBody] Data_input_associate_machine input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_serial", input.serial_number },
        { "in_branch", input.branch_name }
    };

            try
            {
                var result = _databaseService.QuerySingle<Data_output_associate_machine>(
                    "SELECT * FROM sp_associate_machine_to_branch(@in_serial, @in_branch)", parameters);

                return Ok(new Data_response<Data_output_associate_machine>
                {
                    status = true,
                    data = result
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

        [HttpPost("consult_machines_by_branch")]
        public ActionResult<Data_response<Data_output_consult_machine_by_branch>> ConsultMachinesByBranch([FromBody] Data_input_consult_machine_by_branch input)
        {
            var parameters = new Dictionary<string, object>
            {
                { "in_branch_name", input.branch_name }
            };

            try
            {
                var result = _databaseService.Query("SELECT * FROM sp_consult_machines_by_branch(@in_branch_name)", parameters);

                var associated = new List<Data_output_associate_machine>();
                var notAssociated = new List<Data_output_associate_machine>();

                foreach (var row in result)
                {
                    var machine = new Data_output_associate_machine
                    {
                        serial_number = row.serial_number,
                        brand = row.brand,
                        model = row.model,
                        branch_name = row.branch_name
                    };

                    if ((bool)row.is_associated)
                        associated.Add(machine);
                    else
                        notAssociated.Add(machine);
                }

                var dataOutput = new Data_output_consult_machine_by_branch
                {
                    associated_machines = associated,
                    not_associated_machines = notAssociated
                };

                return Ok(new Data_response<Data_output_consult_machine_by_branch>
                {
                    status = true,
                    data = dataOutput
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