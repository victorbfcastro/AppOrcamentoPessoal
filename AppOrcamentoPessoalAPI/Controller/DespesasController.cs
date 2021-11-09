using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using Dapper;
using AppOrcamentoPessoalAPI.Data;
using Microsoft.AspNetCore.Cors;
using Newtonsoft.Json;
using AppOrcamentoPessoalAPI.Model;
using Microsoft.AspNetCore.JsonPatch;
using AppOrcamentoPessoalAPI.Services;

namespace AppOrcamentoPessoalAPI.Controller
{
    [ApiController]
    [EnableCors("AllowAll")]
    [Route("api/[controller]")]
    public class DespesasController : ControllerBase
    {
        public readonly IDespesaService _service;

        public DespesasController(IDespesaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var despesas = await _service.SelectAll();

            return Ok(despesas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var despesa = await _service.SelectById(id);

            return Ok(despesa);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Despesa model)
        {
            var sucesso = _service.Insert(model);

            if (sucesso.Result)
            {
                return Ok(model);
            }

            return BadRequest();

        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var sucesso = _service.Delete(id);

            if (sucesso.Result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPatch("{id}")]
        public ActionResult Patch(int id, Despesa model)
        {

            var sucesso = _service.Patch(id, model);

            if (sucesso.Result)
            {
                return Ok("Alteração feita com sucesso!");
            }

            return BadRequest("Despesa não encontrada!");
        }
    }
}
