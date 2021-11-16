using System;
using AppOrcamentoPessoalAPI.Data;
using AppOrcamentoPessoalAPI.Model;
using AppOrcamentoPessoalAPI.Services;
using Xunit;

namespace APITests
{
    public class GetAllDespesasTest
    {
        [Fact]
        public async void GetAllDespesasNoDB()
        {
            //Arrange
            var repo = new Repository();
            var service = new DespesaService(repo);
        
            //Act
            Despesa[] resultado = await service.SelectAll();

            //Assert
            Assert.NotEmpty(resultado);
        }
    }
}
