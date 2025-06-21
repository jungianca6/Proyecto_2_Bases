using GymTEC.Data_input_models;
using GymTEC.Data_input_models.manage_spa;
using GymTEC.Data_output_models;
using GymTEC.Data_output_models.manage_spa;
using GymTEC.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace GymTEC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SpaTreatmentController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public SpaTreatmentController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }
        /// <summary>
        /// ----------------------  insert_spa_treatment ----------------------
        /// Inserta o edita un tratamiento spa en la base de datos.
        /// Esta operación verifica si el tratamiento ya existe mediante su ID; si existe, lo actualiza,
        /// de lo contrario, inserta uno nuevo. 
        /// </summary>
        /// <param name="input">
        /// Objeto que contiene los siguientes datos:
        /// - treatment_id (int): identificador del tratamiento (0 o un número específico).
        /// - treatment_name (string): nombre del tratamiento spa a registrar o modificar.
        /// </param>
        /// <returns>
        /// Retorna un objeto <see cref="Data_response{T}"/> que contiene:
        /// - status (bool): true si la operación se realizó con éxito; false si ocurrió un error.
        /// - data (Data_output_manage_spa_treatment): información del tratamiento registrado o editado.
        /// En caso de error, se retorna un objeto con detalles del error y su causa.
        /// </returns>
        [HttpPost("insert_spa_treatment")]
        public ActionResult<Data_response<Data_output_manage_spa_treatment>> InsertSpaTreatment([FromBody] Data_input_manage_spa_treatment input)
        {
            // Diccionario con los parámetros esperados por el stored procedure de PostgreSQL
            var parameters = new Dictionary<string, object>
            {
                { "in_id", input.treatment_id },       // ID del tratamiento a editar o 0 si es nuevo
                { "in_name", input.treatment_name }    // Nombre del tratamiento spa
            };

            try
            {
                // Ejecuta la función almacenada que inserta o edita el tratamiento spa
                _databaseService.ExecuteFunction("SELECT sp_insert_or_edit_spa_treatment(@in_id, @in_name)", parameters);

                // Construye el objeto de salida con los mismos datos de entrada (confirmación)
                var data_output = new Data_output_manage_spa_treatment
                {
                    treatment_id = input.treatment_id,
                    treatment_name = input.treatment_name
                };

                // Retorna una respuesta exitosa con los datos del tratamiento
                return Ok(new Data_response<Data_output_manage_spa_treatment>
                {
                    status = true,
                    data = data_output
                });
            }
            catch (Exception ex)
            {
                // En caso de error, retorna un BadRequest con detalles del error y excepción interna
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }


        /// <summary>
        /// ----------------------  edit_spa_treatment ----------------------
        /// Edita un tratamiento spa existente en la base de datos.
        /// Internamente, utiliza el mismo procedimiento almacenado que el insert, ya que el procedimiento
        /// diferencia entre insertar o editar según el valor del ID.
        /// </summary>
        /// <param name="input">
        /// Objeto con los datos del tratamiento a editar:
        /// - treatment_id (int): identificador del tratamiento que se desea modificar.
        /// - treatment_name (string): nuevo nombre o nombre actualizado del tratamiento.
        /// </param>
        /// <returns>
        /// Retorna un objeto <see cref="Data_response{T}"/> que contiene:
        /// - status (bool): true si la operación fue exitosa; false si ocurrió un error.
        /// - data (Data_output_manage_spa_treatment): objeto con los datos del tratamiento actualizado.
        /// En caso de error, se devuelve una descripción del mismo y el mensaje de la excepción interna (si existe).
        /// </returns>
        [HttpPost("edit_spa_treatment")]
        public ActionResult<Data_response<Data_output_manage_spa_treatment>> EditSpaTreatment([FromBody] Data_input_manage_spa_treatment input)
        {
            // Crea el diccionario de parámetros que serán enviados al stored procedure
            var parameters = new Dictionary<string, object>
            {
                { "in_id", input.treatment_id },        // ID del tratamiento a editar
                { "in_name", input.treatment_name }     // Nombre actualizado del tratamiento
            };

            try
            {
                // Ejecuta el stored procedure que inserta o actualiza el tratamiento spa
                _databaseService.ExecuteFunction("SELECT sp_insert_or_edit_spa_treatment(@in_id, @in_name)", parameters);

                // Prepara los datos de salida que confirman la edición
                var data_output = new Data_output_manage_spa_treatment
                {
                    treatment_id = input.treatment_id,
                    treatment_name = input.treatment_name
                };

                // Retorna respuesta con estado exitoso y los datos del tratamiento modificado
                return Ok(new Data_response<Data_output_manage_spa_treatment>
                {
                    status = true,
                    data = data_output
                });
            }
            catch (Exception ex)
            {
                // En caso de excepción, retorna un error detallado con posible causa interna
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        /// <summary>
        /// Elimina un tratamiento spa dado su nombre.
        /// </summary>
        /// <param name="input">Datos que contienen el nombre del tratamiento a eliminar.</param>
        /// <returns>
        /// Respuesta con estado y mensaje de confirmación de eliminación.
        /// </returns>
        /// <remarks>
        /// - Se usa el nombre del tratamiento como criterio de eliminación.
        /// - El nombre debe coincidir exactamente con el registrado.
        /// </remarks>
        [HttpPost("delete_spa_treatment")]
        public ActionResult<Data_response<string>> DeleteSpaTreatment([FromBody] Data_input_delete_spa_treatment input)
        {
            var parameters = new Dictionary<string, object>
            {
                { "in_name", input.treatment_name }
            };

            try
            {
                _databaseService.ExecuteFunction("SELECT sp_delete_spa_treatment(@in_name)", parameters);

                return Ok(new Data_response<string>
                {
                    status = true,
                    data = "Tratamiento eliminado exitosamente"
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
        /// ----------------------  consult_spa_treatment ----------------------
        /// Consulta los detalles de un tratamiento spa a partir de su nombre.
        /// Esta operación utiliza un procedimiento almacenado que busca el tratamiento
        /// en la base de datos comparando por nombre.
        /// </summary>
        /// <param name="input">
        /// Objeto que contiene los datos requeridos para la consulta:
        /// - treatment_name (string): nombre del tratamiento spa a buscar.
        /// </param>
        /// <returns>
        /// Retorna un objeto <see cref="Data_response{T}"/> con:
        /// - status (bool): true si la consulta fue exitosa; false si no se encontró.
        /// - data (Data_output_manage_spa_treatment): contiene el nombre y ID del tratamiento.
        /// En caso de error, se incluye el mensaje de la excepción y detalles internos si existen.
        /// </returns>
        [HttpPost("consult_spa_treatment")]
        public ActionResult<Data_response<Data_output_manage_spa_treatment>> ConsultSpaTreatment([FromBody] Data_input_consult_spa_treatment input)
        {
            // Diccionario con los parámetros que se pasan al stored procedure
            var parameters = new Dictionary<string, object>
            {
                { "p_name", input.treatment_name } // Nombre del tratamiento a buscar
            };

            try
            {
                // Ejecuta el stored procedure para consultar el tratamiento spa por nombre
                var result = _databaseService.QuerySingleOrDefault<Data_output_manage_spa_treatment>(
                    "SELECT * FROM sp_get_spa_treatment_by_name(@p_name)", parameters);

                // Si no se encontró el tratamiento, retorna respuesta con status false
                if (result == null)
                {
                    return NotFound(new Data_response<Data_output_manage_spa_treatment>
                    {
                        status = false,
                        data = null
                    });
                }

                // Retorna los datos del tratamiento encontrado
                return Ok(new Data_response<Data_output_manage_spa_treatment>
                {
                    status = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                // Retorna error con mensaje detallado en caso de excepción
                return BadRequest(new
                {
                    status = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        /// <summary>
        /// ----------------------  consult_associate_spa_treatments ----------------------
        /// Consulta todos los tratamientos spa y clasifica cuáles están asociados
        /// y cuáles no a una sucursal específica según su nombre.
        /// Este método llama dos procedimientos almacenados:
        /// uno para obtener los tratamientos asociados y otro para los no asociados.
        /// </summary>
        /// <param name="input">
        /// Objeto que contiene:
        /// - branch_name (string): nombre de la sucursal a consultar.
        /// </param>
        /// <returns>
        /// Retorna un objeto <see cref="Data_response{T}"/> que contiene:
        /// - status (bool): true si la consulta fue exitosa.
        /// - data (Data_output_associated_treatments_response): contiene dos listas:
        ///   - associated: tratamientos asociados a la sucursal.
        ///   - not_associated: tratamientos que no están asociados a la sucursal.
        /// En caso de error, se incluye el mensaje y detalles internos si los hay.
        /// </returns>
        [HttpPost("consult_associate_spa_treatments")]
        public ActionResult<Data_response<Data_output_associated_treatments_response>> ConsultAssociateSpaTreatments([FromBody] Data_input_consult_associate_spa_treatment input)
        {
            try
            {
                // Parámetro de entrada para los procedimientos almacenados
                var parameters = new Dictionary<string, object>
                {
                    { "p_branch_name", input.branch_name }
                };

                // Consulta tratamientos asociados a la sucursal
                var associated = _databaseService.QueryList<Data_output_associate_spa_treatment>(
                    "SELECT * FROM sp_get_associated_spa_treatments(@p_branch_name)", parameters);

                // Consulta tratamientos no asociados a la sucursal
                var notAssociated = _databaseService.QueryList<Data_output_associate_spa_treatment>(
                    "SELECT * FROM sp_get_not_associated_spa_treatments(@p_branch_name)", parameters);

                // Empaqueta los resultados en una clase de salida
                var responseData = new Data_output_associated_treatments_response
                {
                    associated = associated.ToList(),
                    not_associated = notAssociated.ToList()
                };

                // Retorna la respuesta con estado exitoso
                return Ok(new Data_response<Data_output_associated_treatments_response>
                {
                    status = true,
                    data = responseData
                });
            }
            catch (Exception ex)
            {
                // En caso de error, retorna un objeto con el mensaje y detalles
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