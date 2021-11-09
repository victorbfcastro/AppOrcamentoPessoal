using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppOrcamentoPessoalAPI.Model;
using Microsoft.AspNetCore.JsonPatch;

namespace AppOrcamentoPessoalAPI.Data
{
    public interface IRepository
    {
        Task<Despesa[]> GetAllDespesasAsync();
        Task<Despesa> GetDespesaByIdAsync(int id);
        Task<bool> CadastraDespesaAsync(Despesa despesa);
        Task<bool> RemoveDespesaAsync(int id);
        Task<bool> EditaDespesaAsync(int id, Despesa model);
        
    }
}