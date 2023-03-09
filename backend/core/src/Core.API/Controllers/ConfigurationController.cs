// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.API.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Web.Portal;

namespace Core.API.Controllers
{
    [Route("[controller]")]
    public class ConfigurationController : Controller
    {
        private readonly ConfigOptions _config;

        public ConfigurationController(ConfigOptions config)
        {
            _config = config;
        }


        [HttpGet(Name = "GetConfiguration")]
        [ProducesResponseType(typeof(ConfigOptions), 200)]
        public IActionResult Get()
        {
            return Ok(_config);
        }
    }
}
