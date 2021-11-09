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
using AppOrcamentoPessoalAPI.Data;

namespace AppOrcamentoPessoalAPI.Services
{
    public class DespesaService : IDespesaService
    {
        private IRepository _repo;
        public DespesaService(IRepository repository)
        {
            _repo = repository;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repo.RemoveDespesaAsync(id);
        }

        public async Task<bool> Insert(Despesa despesa)
        {
            return await _repo.CadastraDespesaAsync(despesa);
        }

        public async Task<bool> Patch(int id, Despesa model)
        {
            return await _repo.EditaDespesaAsync(id, model);
        }

        public async Task<Despesa[]> SelectAll()
        {
            return await _repo.GetAllDespesasAsync();
        }

        public async Task<Despesa> SelectById(int id)
        {
            return await _repo.GetDespesaByIdAsync(id);
        }
    }
}