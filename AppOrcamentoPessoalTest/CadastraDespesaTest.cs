using System;
using AppOrcamentoPessoalAPI.Data;
using AppOrcamentoPessoalAPI.Model;
using AppOrcamentoPessoalAPI.Services;
using Xunit;

namespace APITests
{
    public class CadastraDespesaTest
    {
        [Fact]
        public async void CadastraDespesaValidaNoDB()
        {
            //Arrange
            var despesaTeste = new Despesa(99, DateTime.Now, "3", "Teste xUnit", 220);
            var repo = new Repository();
            var service = new DespesaService(repo);
        
            //Act
            var resultado = await service.Insert(despesaTeste);

            //Assert
            Assert.True(resultado);
        }
    }
}
