using System;
using AppOrcamentoPessoalAPI.Data;
using AppOrcamentoPessoalAPI.Model;
using AppOrcamentoPessoalAPI.Services;
using Xunit;

namespace APITests
{
    public class GetDespesaByIdTest
    {
        [Fact]
        public async void GetDespesaByIdNoDB()
        {
            //Arrange
            var repo = new Repository();
            var service = new DespesaService(repo);
        
            //Act
            Despesa resultado = await service.SelectById(43);

            //Assert
            Assert.NotNull(resultado);
        }
    }
}
