using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppOrcamentoPessoalAPI.Model;

namespace AppOrcamentoPessoalAPI.Data
{
    public interface IRepository
    {
        Task<Despesa[]> GetAllDespesasAsync();
        Task<bool> CadastraDespesaAsync(Despesa despesa);
        
    }
}