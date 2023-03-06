using Core.Application.Queries;
using Core.Presentation.Models;
using Core.Presentation.Models.Responses.CustomerResponses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace Core.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiVersion("1.0")]
    public class TrustLevelsController : BaseController
    {
        public TrustLevelsController(ISender sender) : base(sender) { }

        [HttpGet(Name = "GetTrustLevels")]
        [ProducesResponseType(typeof(CustomResponse<IEnumerable<TrustLevelResponse>>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("TrustLevel.Read")]
        public async Task<IActionResult> GetTrustLevelsAsync()
        {
            var query = new GetTrustlevelsQuery(GetUserId());
            var trustlevels = await _sender.Send(query);
            var response = ConstructCustomResponse(trustlevels, TrustLevelResponse.FromTrustlevel);
            return Ok(response);
        }
    }
}
