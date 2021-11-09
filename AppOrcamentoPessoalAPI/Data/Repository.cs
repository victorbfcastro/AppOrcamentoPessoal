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
using Microsoft.AspNetCore.JsonPatch;

namespace AppOrcamentoPessoalAPI.Data
{
    public class Repository : IRepository
    {
        private IConfiguration _config;
        string connectionString = "Data Source=localhost;Initial Catalog=ORCAMENTOPESSOAL;User ID=sa;Password=vT13091991";
        IEnumerable<Despesa> despesas;
        Despesa despesa;
        public Repository()
        {

        }

        public Repository(IConfiguration configuration)
        {
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
        public async Task<Despesa> GetDespesaByIdAsync(int id)
        {
            using (SqlConnection conexao = new SqlConnection(connectionString))
            {
                despesa = await conexao.QueryFirstOrDefaultAsync<Despesa>(
                    $"SELECT * FROM dbo.DESPESA WHERE IDDESPESA = {id}");
            }

            if (despesa != null)
            {
                return despesa;
            }

            return null;
        }
        public async Task<bool> CadastraDespesaAsync(Despesa despesa)
        {
            var data = despesa.DATA_DESP;
            var tipo = despesa.Tipo;
            var descricao = despesa.Descricao;
            var valor = despesa.Valor;

            //PROCEDURE
            using (SqlConnection conexao = new SqlConnection(connectionString))
            using (SqlCommand command = new SqlCommand("[dbo].[PCD_DESPESA_INSERT]", conexao))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@DATA_DESP", SqlDbType.Date).Value = data;
                command.Parameters.Add("@TIPO", SqlDbType.VarChar).Value = tipo;
                command.Parameters.Add("@DESCRICAO", SqlDbType.VarChar).Value = descricao;
                command.Parameters.Add("@VALOR", SqlDbType.Decimal).Value = valor;

                conexao.Open();
                var result = await command.ExecuteNonQueryAsync();

                if(result > 0){
                    return true;
                }

                return false;
            }
        }

        public async Task<bool> RemoveDespesaAsync(int id)
        {

            //PROCEDURE
            using (SqlConnection conexao = new SqlConnection(connectionString))
            using (SqlCommand command = new SqlCommand("[dbo].[PCD_DESPESA_DELETE]", conexao))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@ID", SqlDbType.Int).Value = id;

                conexao.Open();
                var result = await command.ExecuteNonQueryAsync();

                if(result > 0){
                    return true;
                }

                return false;
            }

        }

        public async Task<bool> EditaDespesaAsync(int id, Despesa despesaEditar)
        {

            var sucesso = false;

            var despesaAtual = await GetDespesaByIdAsync(id);

            Despesa novaDespesa = new Despesa();

            if (despesaEditar != null && despesaAtual != null)
            {
                if (despesaEditar.DATA_DESP.Year != 1 && despesaEditar.DATA_DESP != despesaAtual.DATA_DESP)
                {
                    novaDespesa.DATA_DESP = despesaEditar.DATA_DESP;
                }
                else
                {
                    novaDespesa.DATA_DESP = despesaAtual.DATA_DESP;
                }

                if (despesaEditar.Tipo != null && despesaEditar.Tipo != despesaAtual.Tipo)
                {
                    novaDespesa.Tipo = despesaEditar.Tipo;
                }
                else
                {
                    novaDespesa.Tipo = despesaAtual.Tipo;
                }

                if (despesaEditar.Descricao != null && despesaEditar.Descricao != despesaAtual.Descricao)
                {
                    novaDespesa.Descricao = despesaEditar.Descricao;
                }
                else
                {
                    novaDespesa.Descricao = despesaAtual.Descricao;
                }

                if (despesaEditar.Valor > 0 && despesaEditar.Valor != despesaAtual.Valor)
                {
                    novaDespesa.Valor = despesaEditar.Valor;
                }
                else
                {
                    novaDespesa.Valor = despesaAtual.Valor;
                }

                sucesso = await RemoveDespesaAsync(despesaAtual.IDDESPESA);

            }
            else
            {
                return false;
            }

            if (sucesso)
            {
                sucesso = await CadastraDespesaAsync(novaDespesa);
                if (sucesso)
                {
                    return true;
                }
            }

            return false;

        }


    }
}