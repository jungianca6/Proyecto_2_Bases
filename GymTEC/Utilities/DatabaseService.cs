using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;

namespace GymTEC.Utilities
{
    public class DatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = "Host=gymtec.postgres.database.azure.com;Port=5432;Database=GymTEC;Username=Darga1905;Password=Dagamo1905.";
        }

        /// Ejecuta un procedimiento almacenado de PostgreSQL y devuelve un DataTable.
        public DataTable ExecuteFunction(string functionCall, Dictionary<string, object> parameters)
        {
            var dataTable = new DataTable();

            using var connection = new NpgsqlConnection(_connectionString);
            using var command = new NpgsqlCommand(functionCall, connection)
            {
                CommandType = CommandType.Text
            };

            foreach (var param in parameters)
            {
                command.Parameters.AddWithValue(param.Key, param.Value ?? DBNull.Value);
            }

            using var adapter = new NpgsqlDataAdapter(command);
            adapter.Fill(dataTable);

            return dataTable;
        }
    }
}