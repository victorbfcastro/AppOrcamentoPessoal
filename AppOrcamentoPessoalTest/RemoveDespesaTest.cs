using System;
using AppOrcamentoPessoalAPI.Data;
using AppOrcamentoPessoalAPI.Model;
using AppOrcamentoPessoalAPI.Services;
using Xunit;

namespace APITests
{
    public class RemoveDespesaTest
    {
        [Fact]
        public async void RemoveDespesaValidaNoDB()
        {
            //Arrange
            int despesaTesteID = 59;
            var repo = new Repository();
            var service = new DespesaService(repo);
        
            //Act
            var resultado = await service.Delete(despesaTesteID);

            //Assert
            Assert.True(resultado);
        }
    }
}
