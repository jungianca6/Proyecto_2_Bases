using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_product;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_product;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace GymTEC.Controllers
{


    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {

        private readonly DatabaseService _databaseService;

        public ProductController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        /// <summary>
        /// Inserta o edita un producto.
        /// </summary>
        /// <param name="input">Objeto Data_input_product con:
        /// - product_name: Nombre del producto.
        /// - barcode: Código de barras del producto (identificador único).
        /// - description: Descripción del producto.
        /// - cost: Costo del producto.
        /// </param>
        /// <returns>
        /// Data_response con el producto insertado o editado.
        /// - status: true si la operación fue exitosa.
        /// - data: Data_output_product con los datos del producto.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El barcode debe ser único para insertar.
        /// - Para edición, el barcode debe existir.
        /// </remarks>
        [HttpPost("insert_or_edit")]
        public ActionResult<Data_response<Data_output_product>> InsertOrEditProduct([FromBody] Data_input_product input)
        {
            var parameters = new Dictionary<string, object>
            {
                { "in_name", input.product_name },
                { "in_barcode", input.barcode },
                { "in_description", input.description },
                { "in_cost", input.cost }
            };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_insert_or_edit_product(@in_name, @in_barcode, @in_description, @in_cost)", parameters);

                var data_output = new Data_output_product
                {
                    product_name = input.product_name,
                    barcode = input.barcode,
                    description = input.description,
                    cost = input.cost
                };

                var response = new Data_response<Data_output_product>
                {
                    status = true,
                    data = data_output
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
        /// Elimina un producto existente por su código de barras.
        /// </summary>
        /// <param name="input">Objeto Data_input_product con:
        /// - barcode: Código de barras del producto a eliminar.
        /// </param>
        /// <returns>
        /// Data_response con mensaje de éxito.
        /// - status: true si la eliminación fue exitosa.
        /// - data: Mensaje de confirmación.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El producto debe existir para ser eliminado.
        /// </remarks>
        [HttpPost("delete")]
        public ActionResult<Data_response<string>> DeleteProduct([FromBody] Data_input_product input)
        {
            var parameters = new Dictionary<string, object>
            {
                { "in_barcode", input.barcode }
            };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_delete_product(@in_barcode)", parameters);

                var response = new Data_response<string>
                {
                    status = true,
                    data = "Producto eliminado exitosamente"
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
        /// Consulta un producto por su código de barras.
        /// </summary>
        /// <param name="input">Objeto Data_input_product con:
        /// - barcode: Código de barras del producto a consultar.
        /// </param>
        /// <returns>
        /// Data_response con los datos del producto consultado.
        /// - status: true si la consulta fue exitosa.
        /// - data: Data_output_product con los datos del producto.
        /// </returns>
        /// <remarks>
        /// Restricciones:
        /// - El producto debe existir para la consulta.
        /// </remarks>
        [HttpPost("get")]
        public ActionResult<Data_response<Data_output_product>> GetProduct([FromBody] Data_input_product input)
        {
            var parameters = new Dictionary<string, object>
            {
                { "in_barcode", input.barcode }
            };

            try
            {
                // Usa QuerySingleOrDefault en lugar de QuerySingle
                var result = _databaseService.QuerySingleOrDefault<Data_output_product>(
                    "SELECT * FROM sp_get_product(@in_barcode)", parameters);

                if (result == null)
                {
                    return NotFound(new Data_response<Data_output_product>
                    {
                        status = false,
                        data = null
                    });
                }

                return Ok(new Data_response<Data_output_product>
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

    }


}