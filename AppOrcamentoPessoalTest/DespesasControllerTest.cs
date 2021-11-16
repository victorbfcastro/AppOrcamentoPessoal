using System;
using AppOrcamentoPessoalAPI.Controller;
using AppOrcamentoPessoalAPI.Data;
using AppOrcamentoPessoalAPI.Model;
using AppOrcamentoPessoalAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace APITests
{
    public class DespesasControllerTest
    {
        [Fact]
        public async void GetTestSucesso()
        {
            //Arrange
            var repo = new Repository();
            var service = new DespesaService(repo);
            var controlador = new DespesasController(service);
        
            //Act
            var resultado = await controlador.Get();

            //Assert
            Assert.IsType<OkObjectResult>(resultado);
        }

        [Fact]
        public async void GetByIdTestSucesso()
        {
            //Arrange
            var repo = new Repository();
            var service = new DespesaService(repo);
            var controlador = new DespesasController(service);
        
            //Act
            var resultado = await controlador.GetById(43);

            //Assert
            Assert.IsType<OkObjectResult>(resultado);
        }

        [Fact]
        public void PostTestSucesso()
        {
            //Arrange
            var repo = new Repository();
            var service = new DespesaService(repo);
            var controlador = new DespesasController(service);

            Despesa despesaTeste = new Despesa(1, new DateTime(2021, 5, 13), "3", "xUnit PostTest", 150);
            //Act
            var resultado = controlador.Post(despesaTeste);

            //Assert
            Assert.IsType<OkObjectResult>(resultado);
        }

        [Fact]
        public void DeleteTestSucesso()
        {
            //Arrange
            var repo = new Repository();
            var service = new DespesaService(repo);
            var controlador = new DespesasController(service);
        
            //Act
            var resultado = controlador.Delete(46);

            //Assert
            Assert.IsType<OkResult>(resultado);
        }

        [Fact]
        public void PatchTestSucesso()
        {
            //Arrange
            var repo = new Repository();
            var service = new DespesaService(repo);
            var controlador = new DespesasController(service);

            Despesa despesaTeste = new Despesa(1, new DateTime(2021, 5, 13), "3", "xUnit PatchTest", 150);

        
            //Act
            var resultado = controlador.Patch(62, despesaTeste);

            //Assert
            Assert.IsType<OkObjectResult>(resultado);
        }

        // [Fact]
        // public void GetTestFalha()
        // {
        //     //Arrange
        //     var repo = new Repository();
        //     var service = new DespesaService(repo);

        //     var controller = new DespesasController(service);

        //     //Act
        //     var resultado = mock;

        //     //Assert
        //     Assert.IsType<NoContentResult>(resultado);
        // }
    }
}
