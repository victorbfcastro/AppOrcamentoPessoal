using System.Threading.Tasks;
using AppOrcamentoPessoalAPI.Model;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Linq;
using System;

namespace AppOrcamentoPessoalAPI.Data
{
    public class Repository : IRepository
    {
        private IConfiguration _config;
        string connectionString = "Data Source=localhost;Initial Catalog=ORCAMENTOPESSOAL;User ID=sa;Password=vT13091991";
        IEnumerable<Despesa> despesas;
        public Repository()
        {
            
        }

        public Repository(IConfiguration configuration){
            _config = configuration;
        }


        public async Task<Despesa[]> GetAllDespesasAsync()
        {
            
            using (SqlConnection conexao = new SqlConnection(connectionString))
            {
                despesas = await conexao.QueryAsync<Despesa>(
                    "SELECT * FROM DESPESA");
            }

            return despesas.ToArray();
        }
        public async Task<bool> CadastraDespesaAsync(Despesa despesa)
        {
            using (SqlConnection conexao = new SqlConnection(connectionString))
            {
                var data = despesa.DATA_DESP;
                var tipo = despesa.Tipo;
                var descricao = despesa.Descricao;
                var valor = despesa.Valor;

                var parametros = new DynamicParameters();
                parametros.Add("@DATA_DESP", data, DbType.AnsiString, ParameterDirection.Input, 255);
                parametros.Add("@TIPO", tipo, DbType.AnsiString, ParameterDirection.Input, 255);
                parametros.Add("@DESCRICAO", descricao, DbType.AnsiString, ParameterDirection.Input, 255);
                parametros.Add("@VALOR", valor);
                var query = "INSERT INTO DESPESA(DATA_DESP, TIPO, DESCRICAO, VALOR) VALUES(@DATA_DESP, @TIPO, @DESCRICAO, @VALOR)";

                int response = await conexao.ExecuteAsync(query, parametros);

                if(response > 0){
                    return true;
                }

                return false;
            }   
        }

       
    }
}