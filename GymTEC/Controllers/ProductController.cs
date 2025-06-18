using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_branch;
using GymTEC.Data_input_models.manage_product;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_branch;
using GymTEC.Data_output_models.manage_product;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

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
            // Lógica para insertar o editar producto

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
            // Lógica para eliminar producto por barcode

            var response = new Data_response<string>
            {
                status = true,
                data = "Producto eliminado exitosamente"
            };

            return Ok(response);
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
            // Lógica para consultar producto por barcode

            var data_output = new Data_output_product
            {
                product_name = "Proteína Whey",
                barcode = input.barcode,
                description = "Suplemento alimenticio para ganancia muscular",
                cost = 45000.00
            };

            var response = new Data_response<Data_output_product>
            {
                status = true,
                data = data_output
            };

            return Ok(response);
        }
    }
}