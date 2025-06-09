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