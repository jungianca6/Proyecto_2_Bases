using GymTEC.Data_input_models.manage_product;
using GymTEC.Data_output_models.manage_product;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StoreProductController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public StoreProductController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost("associate_store_product")]
        public ActionResult<Data_response<string>> AssociateStoreProduct([FromBody] Data_input_associate_store_product input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_barcode", input.barcode },
        { "in_store_name", input.store_name },
        { "in_date", input.date },
        { "in_amount", input.Amaunt }
    };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_associate_store_product(@in_barcode, @in_store_name, @in_date, @in_amount)", parameters);

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = $"Producto con código {input.barcode} asociado correctamente a la tienda {input.store_name}."
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


        [HttpPost("consult_store_products")]
        public ActionResult<Data_response<Data_output_store_products>> ConsultStoreProducts([FromBody] Data_input_consult_store_products input)
        {
            try
            {
                var parameters = new Dictionary<string, object>
        {
            { "p_store_name", input.store_name }
        };

                // Productos asociados
                var associated = _databaseService.QueryList<Data_output_associate_store_product>(
                    "SELECT * FROM sp_get_associated_store_products(@p_store_name)", parameters);

                // Productos no asociados
                var nonAssociated = _databaseService.QueryList<Data_output_associate_store_product>(
                    "SELECT * FROM sp_get_not_associated_store_products(@p_store_name)", parameters);

                var responseData = new Data_output_store_products
                {
                    associated_products = associated.ToList(),
                    non_associated_products = nonAssociated.ToList()
                };

                return Ok(new Data_response<Data_output_store_products>
                {
                    status = true,
                    data = responseData
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


        [HttpPost("insert_store")]
        public ActionResult<Data_response<string>> InsertStore([FromBody] Data_input_store input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_branch_name", input.branch_name },
        { "in_store_name", input.store_name },
        { "in_is_active", input.is_active }
    };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_insert_store(@in_branch_name, @in_store_name, @in_is_active)", parameters);

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = "Tienda insertada correctamente."
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

        [HttpPost("edit_store")]
        public ActionResult<Data_response<string>> EditStore([FromBody] Data_input_store input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_branch_name", input.branch_name },
        { "in_store_name", input.store_name },
        { "in_is_active", input.is_active }
    };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_edit_store(@in_branch_name, @in_store_name, @in_is_active)", parameters);

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = "Tienda actualizada correctamente."
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
        [HttpPost("get/stores")]
        public ActionResult<Data_response<List<Data_output_stores>>> GetStoresByBranch([FromBody] Data_input_get_store input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_branch_name", input.branch_name }
    };

            try
            {
                var resultRaw = _databaseService.Query("SELECT * FROM sp_get_stores_by_branch_name(@in_branch_name)", parameters);

                var result = resultRaw.Select(r => new Data_output_stores
                {
                    store_id = r.store_id,
                    name = r.name,
                    is_active = r.is_active,
                    branch_name = r.branch_name
                }).ToList();

                return Ok(new Data_response<List<Data_output_stores>>
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



        [HttpPost("delete/store")]
        public ActionResult<Data_response<bool>> DeleteStore([FromBody] Data_input_delete_store input)
        {
            var parameters = new Dictionary<string, object>
    {
        { "in_store_name", input.store_name }
    };

            try
            {
                // IMPORTANTE: especificar tipo <bool>
                var result = _databaseService.QuerySingle<bool>(
                    "SELECT * FROM sp_delete_store_by_name(@in_store_name)",
                    parameters
                );

                return Ok(new Data_response<bool>
                {
                    status = result,
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







    }
}
