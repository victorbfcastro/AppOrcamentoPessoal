using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppOrcamentoPessoalAPI.Model;
using Microsoft.AspNetCore.JsonPatch;

namespace AppOrcamentoPessoalAPI.Services
{
    public interface IDespesaService
    {
        Task<Despesa[]> SelectAll();
        Task<Despesa> SelectById(int id);
        Task<bool> Insert(Despesa despesa);
        Task<bool> Delete(int id);
        Task<bool> Patch(int id, Despesa model);
    }
}