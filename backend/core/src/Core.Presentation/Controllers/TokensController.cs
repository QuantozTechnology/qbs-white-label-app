// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Queries.TokenQueries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Core.Presentation.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class TokensController : BaseController
    {
        public TokensController(ISender sender) : base(sender) { }

        // Get available tokens
        [HttpGet(Name = "GetTokens")]
        [ProducesResponseType(typeof(CustomResponse<TokenResponse>), 200)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 404)]
        [ProducesResponseType(typeof(CustomErrorsResponse), 500)]
        [RequiredScope("Token.Read")]
        public async Task<IActionResult> GetTokensAsync([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetPagedTokensQuery(GetUserId(), status, page, pageSize);
            var tokens = await _sender.Send(query);
            var response = ConstructCustomResponse(tokens, TokenResponse.FromToken);
            return Ok(response);
        }
    }
}
