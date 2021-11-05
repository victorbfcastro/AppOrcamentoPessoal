﻿using System;
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

namespace AppOrcamentoPessoalAPI.Controllers
{
    [ApiController]
    [EnableCors("AllowAll")]
    [Route("api/[controller]")]
    public class DespesasController : ControllerBase
    {
        public readonly IRepository _repo;
        
        private IConfiguration _config;
        public DespesasController(IConfiguration configuration, IRepository repo)
        {
            _config = configuration;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get(){
            var despesas = await _repo.GetAllDespesasAsync();

            return Ok(despesas);
        }
    }
}