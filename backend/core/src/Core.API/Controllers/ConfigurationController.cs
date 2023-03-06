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
