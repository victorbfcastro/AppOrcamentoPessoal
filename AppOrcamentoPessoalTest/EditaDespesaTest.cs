using System;
using AppOrcamentoPessoalAPI.Data;
using AppOrcamentoPessoalAPI.Model;
using AppOrcamentoPessoalAPI.Services;
using Xunit;

namespace APITests
{
    public class EditaDespesaTest
    {
        [Fact]
        public async void EditaDespesaValidaNoDB()
        {
            //Arrange
            var novaDespesaTeste = new Despesa(99, new DateTime(2019, 11, 27), "3", "Teste xUnit", 220);
            int despesaTesteID = 51;
            var repo = new Repository();
            var service = new DespesaService(repo);
        
            //Act
            var resultado = await service.Patch(despesaTesteID, novaDespesaTeste);

            //Assert
            Assert.True(resultado);
        }
    }
}
