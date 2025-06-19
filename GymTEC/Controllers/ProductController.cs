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
        /// ----------------------  insert_or_edit ----------------------
        /// Inserta un nuevo producto o edita uno existente en el sistema de inventario.
        /// Esta operación se basa en el código de barras (`barcode`) como identificador único.
        /// Si el producto ya existe con ese código, se actualizan sus datos;
        /// si no existe, se inserta como uno nuevo con store_id = 1 por defecto.
        /// </summary>
        /// <param name="input">
        /// Objeto de tipo <see cref="Data_input_product"/> que contiene:
        /// - product_name (string): Nombre del producto.
        /// - barcode (string): Código de barras único del producto.
        /// - description (string): Descripción detallada del producto.
        /// - cost (int): Costo del producto en colones (sin decimales).
        /// </param>
        /// <returns>
        /// Retorna un objeto <see cref="Data_response{T}"/> con los siguientes datos:
        /// - status (bool): true si la operación fue exitosa; false en caso de error.
        /// - data (Data_output_product): contiene los datos insertados o actualizados del producto.
        /// </returns>
        /// <remarks>
        /// Reglas del procedimiento:
        /// - Si el `barcode` ya existe en la tabla Product, el producto será actualizado.
        /// - Si no existe, se inserta uno nuevo con los datos proporcionados.
        /// - El campo `store_id` es asignado por defecto con el valor 1.
        /// </remarks>
        [HttpPost("insert_or_edit")]
        public ActionResult<Data_response<Data_output_product>> InsertOrEditProduct([FromBody] Data_input_product input)
        {
            // Diccionario de parámetros para ejecutar el procedimiento almacenado
            var parameters = new Dictionary<string, object>
    {
        { "in_name", input.product_name },
        { "in_barcode", input.barcode },
        { "in_description", input.description },
        { "in_cost", input.cost }
    };

            try
            {
                // Ejecuta el procedimiento almacenado de inserción o actualización
                _databaseService.ExecuteFunction("SELECT sp_insert_or_edit_product(@in_name, @in_barcode, @in_description, @in_cost)", parameters);

                // Construye la respuesta de salida con los mismos datos recibidos
                var data_output = new Data_output_product
                {
                    product_name = input.product_name,
                    barcode = input.barcode,
                    description = input.description,
                    cost = input.cost
                };

                return Ok(new Data_response<Data_output_product>
                {
                    status = true,
                    data = data_output
                });
            }
            catch (Exception ex)
            {
                // Retorna un error detallado en caso de fallo
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }


        /// <summary>
        /// ----------------------  delete ----------------------
        /// Elimina un producto existente del sistema utilizando su código de barras como identificador único.
        /// </summary>
        /// <param name="input">
        /// Objeto de tipo <see cref="Data_input_product"/> que contiene:
        /// - barcode (string): Código de barras del producto a eliminar.
        /// </param>
        /// <returns>
        /// Retorna un objeto <see cref="Data_response{T}"/> con:
        /// - status (bool): true si la operación fue exitosa.
        /// - data (string): Mensaje de confirmación de la eliminación.
        /// </returns>
        /// <remarks>
        /// Requisitos:
        /// - El código de barras debe pertenecer a un producto existente en la base de datos.
        /// - Si no existe, se capturará una excepción desde la base de datos o se ignorará silenciosamente dependiendo del procedimiento.
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
        /// ----------------------  get ----------------------
        /// Consulta los datos de un producto específico mediante su código de barras.
        /// </summary>
        /// <param name="input">
        /// Objeto de tipo <see cref="Data_input_product"/> que contiene:
        /// - barcode (string): Código de barras del producto a consultar.
        /// </param>
        /// <returns>
        /// Retorna un objeto <see cref="Data_response{T}"/> con:
        /// - status (bool): true si la consulta fue exitosa; false si no se encontró el producto.
        /// - data (Data_output_product): Datos del producto encontrado, o null si no existe.
        /// </returns>
        /// <remarks>
        /// Requisitos:
        /// - El producto debe estar registrado previamente con el código de barras proporcionado.
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
                // Se intenta obtener el producto con el código proporcionado
                var result = _databaseService.QuerySingleOrDefault<Data_output_product>(
                    "SELECT * FROM sp_get_product(@in_barcode)", parameters);

                if (result == null)
                {
                    // Retorna NotFound si no se encontró ningún producto
                    return NotFound(new Data_response<Data_output_product>
                    {
                        status = false,
                        data = null
                    });
                }

                // Retorna el producto encontrado
                return Ok(new Data_response<Data_output_product>
                {
                    status = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                // Retorna error detallado en caso de excepción
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