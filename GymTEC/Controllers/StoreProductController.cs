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
            // Simulación de asociación del producto a la sucursal
            var response = new Data_response<string>
            {
                status = true,
                data = $"Producto con código {input.barcode} asociado a la sucursal {input.branch_name} exitosamente"
            };

            return Ok(response);
        }

        [HttpPost("consult_store_products")]
        public ActionResult<Data_response<Data_output_store_products>> ConsultStoreProducts([FromBody] Data_input_consult_store_products input)
        {
            // Simulación de consulta: productos asociados y no asociados
            var associated = new List<Data_output_associate_store_product>
            {
                new Data_output_associate_store_product { barcode = "1234567890123", product_name = "Proteína Whey" },
                new Data_output_associate_store_product { barcode = "9876543210987", product_name = "Aminoácidos" }
            };

            var nonAssociated = new List<Data_output_associate_store_product>
            {
                new Data_output_associate_store_product { barcode = "1928374650912", product_name = "Creatina" },
                new Data_output_associate_store_product { barcode = "5647382910123", product_name = "Barra energética" }
            };

            var responseData = new Data_output_store_products
            {
                associated_products = associated,
                non_associated_products = nonAssociated
            };

            var response = new Data_response<Data_output_store_products>
            {
                status = true,
                data = responseData
            };

            return Ok(response);
        }
    }
}
