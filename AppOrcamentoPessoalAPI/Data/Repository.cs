using System.Threading.Tasks;
using AppOrcamentoPessoalAPI.Model;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Linq;

namespace AppOrcamentoPessoalAPI.Data
{
    public class Repository : IRepository
    {
        private IConfiguration _config;
        IEnumerable<Despesa> despesas;
        public Repository()
        {
            
        }

        public Repository(IConfiguration configuration){
            _config = configuration;
        }

        public async Task<Despesa[]> GetAllDespesasAsync()
        {
            string connectionString = "Data Source=localhost;Initial Catalog=ORCAMENTOPESSOAL;User ID=sa;Password=vT13091991";
            using (SqlConnection conexao = new SqlConnection(connectionString))
            {
                despesas = await conexao.QueryAsync<Despesa>(
                    "SELECT * FROM DESPESA");
            }

            return despesas.ToArray();
        }

        public Task<Despesa[]> GetDespesasByFiltro(string filtro)
        {
            throw new System.NotImplementedException();
        }
    }
}