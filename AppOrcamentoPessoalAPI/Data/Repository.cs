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

                if (response > 0)
                {
                    return true;
                }

                return false;
            }
        }

        public async Task<bool> RemoveDespesaAsync(int id)
        {
            using (SqlConnection conexao = new SqlConnection(connectionString))
            {
                var query = $"DELETE FROM DESPESA WHERE IDDESPESA = {id}";

                int response = await conexao.ExecuteAsync(query);

                if (response > 0)
                {
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

            }else{
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